import subprocess, os
P="/Users/takahiroinaba/Downloads/ROBOTECH ASIA 2026 – Robotics & Intelligent Manufacturing Exhibition_2026亚洲具身机器人应用及供应链展"
OUT=os.path.expanduser('~/Downloads/robotech-2026-short-hook.mp4')
FR='scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,setsar=1,format=yuv420p'
def run(c): subprocess.run(c,check=True)
segs=[('s1','1935_raw.MP4',0.4,3.0,'hook',True,False),('s2','1928_raw.MP4',8.6,2.6,'piano',False,False),('s3','1927_raw.MP4',1.6,2.6,'walk',False,False),
      ('s4','1926.MP4',3.2,2.6,'dance',False,False),('s5','1933_raw.MP4',5.5,3.0,'carnival',False,False),('s6','1936.MP4',7.5,2.8,'box',False,False),('s7','1936.MP4',10.5,3.6,'end',False,True)]
for n,src,ss,t,cap,instant,end in segs:
  vf=FR+(',gblur=sigma=26,eq=brightness=-0.22:saturation=0.8' if end else '')
  if instant: cf='format=rgba'                       # caption on screen from frame one
  elif end:   cf='format=rgba,fade=in:st=0.2:d=0.5:alpha=1'
  else:       cf=f'format=rgba,fade=in:st=0.0:d=0.25:alpha=1,fade=out:st={t-0.3}:d=0.25:alpha=1'
  yexpr = '0' if instant else "'if(lt(t\\,0.4)\\,30*(1-t/0.4)\\,0)'"
  af=f'aresample=48000,aformat=channel_layouts=stereo,afade=in:d=0.15,afade=out:st={t-0.25}:d=0.25' + (f',volume=0.7' if end else '')
  fc=f"[0:v]{vf}[v];[1:v]{cf}[c];[v][c]overlay=x=0:y={yexpr}:shortest=1,format=yuv420p[o];[0:a]{af}[a]"
  run(['ffmpeg','-v','error','-y','-ss',str(ss),'-t',str(t),'-i',f'{P}/{src}','-loop','1','-t',str(t),'-i',f'{cap}.png','-filter_complex',fc,'-map','[o]','-map','[a]','-t',str(t),'-c:v','libx264','-preset','medium','-crf','18','-r','30','-c:a','aac','-b:a','192k','-ar','48000',f'{n}.mp4'])
X=0.2; ins=[]
for s in segs: ins+=['-i',f'{s[0]}.mp4']
fc=''; vprev='[0:v]'; aprev='[0:a]'; off=0.0
for i in range(1,len(segs)):
  off+=segs[i-1][3]-X
  fc+=f"{vprev}[{i}:v]xfade=transition=fade:duration={X}:offset={off:.3f}[v{i}];{aprev}[{i}:a]acrossfade=d={X}[a{i}];"
  vprev=f'[v{i}]'; aprev=f'[a{i}]'
fc+=f"{aprev}loudnorm=I=-14:TP=-1.5:LRA=11[aout]"
run(['ffmpeg','-v','error','-y']+ins+['-filter_complex',fc,'-map',vprev,'-map','[aout]','-c:v','libx264','-preset','medium','-crf','18','-r','30','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',OUT])
print('saved',OUT)
