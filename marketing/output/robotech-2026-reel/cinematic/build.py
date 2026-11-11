import subprocess, os, sys
MODE=sys.argv[1]  # reel | post
W,H=(1080,1920) if MODE=='reel' else (1080,1350)
CAPDIR='.' if MODE=='reel' else 'post'
P="/Users/takahiroinaba/Downloads/ROBOTECH ASIA 2026 – Robotics & Intelligent Manufacturing Exhibition_2026亚洲具身机器人应用及供应链展"
OUT=os.path.expanduser(f"~/Downloads/robotech-2026-cinematic-{'reel-9x16' if MODE=='reel' else 'post-4x5'}.mp4")
def run(c): subprocess.run(c,check=True)
def atempo(slow):
  r=1/slow; parts=[]
  while r<0.5: parts.append('atempo=0.5'); r/=0.5
  parts.append(f'atempo={r:.4f}'); return ','.join(parts)+','
GRADE=("eq=contrast=1.06:saturation=0.92:gamma=1.02,colorbalance=rs=0.03:bs=-0.04:rm=0.03:bm=-0.03,"
       "vignette=angle=PI/4.6:mode=forward,noise=alls=6:allf=t")
if MODE=='reel':
  BASE=f'scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1'
  def frame(vf): return f"[0:v]{vf}[v]"
else:
  # fit the whole vertical frame inside 4:5 over a blurred copy of itself: nothing is cropped
  def frame(vf):
    return (f"[0:v]{vf},split[a][b];[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},gblur=sigma=40,eq=brightness=-0.18[bg];"
            f"[b]scale={W}:{H}:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1[v]")
  BASE='setsar=1'
segs=[('s1','1935_raw.MP4',0.4,2.4,2.0,'open',False),
      ('s2','1928_raw.MP4',8.0,3.6,1.0,'piano',False),
      ('s3','1927_raw.MP4',1.0,2.8,1.4,'walk',False),
      ('s4','1926.MP4',2.5,3.4,1.0,'dance',False),
      ('s5','1933_raw.MP4',4.5,4.0,1.0,'carnival',False),
      ('s6','1936.MP4',7.0,2.0,2.0,'box',False),
      ('s7','1935_raw.MP4',5.0,2.0,2.0,'end',True)]
for n,src,ss,sd,slow,cap,end in segs:
  t=round(sd*slow,2)
  vf=f"{BASE},setpts={slow}*PTS,fps=30,{GRADE}"
  if end: vf+=',gblur=sigma=30,eq=brightness=-0.25:saturation=0.75'
  cf=('format=rgba,fade=in:st=0.3:d=0.8:alpha=1' if end else f'format=rgba,fade=in:st=0.3:d=0.7:alpha=1,fade=out:st={t-0.9}:d=0.7:alpha=1')
  af=(atempo(slow) if slow!=1.0 else '')+f"aresample=48000,aformat=channel_layouts=stereo,afade=in:d=0.4,afade=out:st={t-0.7}:d=0.7"+(',volume=0.6' if end else '')
  fc=f"{frame(vf)};[1:v]{cf}[c];[v][c]overlay=0:0:shortest=1,format=yuv420p[o];[0:a]{af}[a]"
  run(['ffmpeg','-v','error','-y','-ss',str(ss),'-t',str(sd),'-i',f'{P}/{src}','-loop','1','-t',str(t),'-i',f'{CAPDIR}/{cap}.png','-filter_complex',fc,'-map','[o]','-map','[a]','-t',str(t),'-c:v','libx264','-preset','medium','-crf','18','-r','30','-c:a','aac','-b:a','192k','-ar','48000',f'{MODE}_{n}.mp4'])
X=0.8; ins=[]
for s in segs: ins+=['-i',f'{MODE}_{s[0]}.mp4']
total=sum(round(s[3]*s[4],2) for s in segs)-X*(len(segs)-1)
fc=''; vprev='[0:v]'; aprev='[0:a]'; off=0.0
for i in range(1,len(segs)):
  off+=round(segs[i-1][3]*segs[i-1][4],2)-X
  fc+=f"{vprev}[{i}:v]xfade=transition=dissolve:duration={X}:offset={off:.3f}[v{i}];{aprev}[{i}:a]acrossfade=d={X}[a{i}];"
  vprev=f'[v{i}]'; aprev=f'[a{i}]'
fc+=f"{vprev}fade=in:st=0:d=0.6,fade=out:st={total-1.2:.2f}:d=1.2[vout];{aprev}loudnorm=I=-16:TP=-1.5:LRA=11,afade=out:st={total-1.4:.2f}:d=1.4[aout]"
run(['ffmpeg','-v','error','-y']+ins+['-filter_complex',fc,'-map','[vout]','-map','[aout]','-c:v','libx264','-preset','medium','-crf','18','-r','30','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',OUT])
print('saved',OUT,round(total,1),'s')
