import subprocess, os
P="/Users/takahiroinaba/Downloads/ROBOTECH ASIA 2026 – Robotics & Intelligent Manufacturing Exhibition_2026亚洲具身机器人应用及供应链展"
OUT=os.path.expanduser('~/Downloads/robotech-2026-shenzhen-reel.mp4')
FR='scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,setsar=1,format=yuv420p'
def run(c): subprocess.run(c,check=True)
# (name, kind, src, start, dur, caption, extra)
segs=[
 ('s01','v','1935_raw.MP4',0.5,4.0,'hook',''),
 ('s02','v','1936.MP4',6.0,4.5,'expo',''),
 ('s03','p','IMG_20261029_153359.jpg',0,3.0,'sign','in'),
 ('s04','v','1888.MP4',0.0,4.0,'metro',''),
 ('s05','v','1928_raw.MP4',0.0,4.5,'piano',''),
 ('s06','v','1927_raw.MP4',1.2,4.5,'walk',''),
 ('s07','v','1926.MP4',2.0,4.5,'dance',''),
 ('s08','v','1933_raw.MP4',4.0,5.5,'carnival',''),
 ('s09','p','IMG_20261029_152637.jpg',0,3.0,'cruzr','in'),
 ('s10','p','IMG_20261029_145958.jpg',0,3.0,'fire','pan'),
 ('s11','p','IMG_20261029_134044.jpg',0,3.0,'sea','in'),
 ('s12','v','1891.MP4',4.0,3.5,'cafe',''),
 ('s13','p','1917.JPG',0,3.0,'soup','in'),
 ('s14','v','1933_raw.MP4',12.0,5.0,'end','blur'),
]
for n,kind,src,ss,t,cap,extra in segs:
  frames=int(t*30)
  if kind=='v':
    vf=FR
    if extra=='blur': vf=FR+',gblur=sigma=26,eq=brightness=-0.2:saturation=0.8'
    cf=('format=rgba,fade=in:st=0.25:d=0.6:alpha=1' if extra=='blur' else f'format=rgba,fade=in:st=0.1:d=0.45:alpha=1,fade=out:st={t-0.5}:d=0.4:alpha=1')
    af=f'aresample=48000,aformat=channel_layouts=stereo,afade=in:d=0.3,afade=out:st={t-0.6}:d=0.6'
    fc=(f"[0:v]{vf}[v];[1:v]{cf}[c];[v][c]overlay=x=0:y='if(lt(t\\,0.6)\\,40*(1-t/0.6)\\,0)':shortest=1,format=yuv420p[o];[0:a]{af}[a]")
    run(['ffmpeg','-v','error','-y','-ss',str(ss),'-t',str(t),'-i',f'{P}/{src}','-loop','1','-t',str(t),'-i',f'{cap}.png','-filter_complex',fc,'-map','[o]','-map','[a]','-t',str(t),'-c:v','libx264','-preset','medium','-crf','18','-r','30','-c:a','aac','-b:a','192k','-ar','48000',f'{n}.mp4'])
  else:
    if extra=='pan':   # landscape photo: slow pan left to right across a portrait window
      zp=f"scale=2560:1920,zoompan=z=1.0:x='(iw-1080)*on/{frames}':y=0:d={frames}:s=1080x1920:fps=30"
    else:              # portrait photo: slow push in
      zp=f"scale=1296:2304:force_original_aspect_ratio=increase,crop=1296:2304,zoompan=z='1.0+0.12*on/{frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s=1080x1920:fps=30"
    cf=f'format=rgba,fade=in:st=0.1:d=0.45:alpha=1,fade=out:st={t-0.5}:d=0.4:alpha=1'
    fc=(f"[0:v]{zp},setsar=1[v];[1:v]{cf}[c];[v][c]overlay=x=0:y='if(lt(t\\,0.6)\\,40*(1-t/0.6)\\,0)':shortest=1,format=yuv420p[o];anullsrc=r=48000:cl=stereo[a]")
    run(['ffmpeg','-v','error','-y','-loop','1','-t',str(t),'-i',f'{P}/{src}','-loop','1','-t',str(t),'-i',f'{cap}.png','-filter_complex',fc,'-map','[o]','-map','[a]','-t',str(t),'-c:v','libx264','-preset','medium','-crf','18','-r','30','-c:a','aac','-b:a','192k','-ar','48000',f'{n}.mp4'])
  print(n,'ok',flush=True)
# chain with cross-fades
X=0.45
ins=[]; 
for s in segs: ins+=['-i',f'{s[0]}.mp4']
fc=''; vprev='[0:v]'; aprev='[0:a]'; off=0.0
for i in range(1,len(segs)):
  off+=segs[i-1][4]-X
  fc+=f"{vprev}[{i}:v]xfade=transition=fade:duration={X}:offset={off:.3f}[v{i}];{aprev}[{i}:a]acrossfade=d={X}[a{i}];"
  vprev=f'[v{i}]'; aprev=f'[a{i}]'
fc+=f"{aprev}loudnorm=I=-14:TP=-1.5:LRA=11[aout]"
run(['ffmpeg','-v','error','-y']+ins+['-filter_complex',fc,'-map',vprev,'-map','[aout]','-c:v','libx264','-preset','medium','-crf','18','-r','30','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',OUT])
print('saved',OUT)
