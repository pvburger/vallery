import { useEffect, useRef, useState } from 'react';
import type { VideoItemProps } from '../../types';

export default function VideoItem(props: VideoItemProps) {
  const [tStamp, setTStamp] = useState(0);

  const {
    path,
    vWidth,
    aspRatio,
    mute,
    autoStart,
    randStart,
    maxVidId,
    maxVidIdSet,
  } = props;

  const srcAddress = `http://127.0.0.1:3333/video?path=${path}`;
  const lastSlash = path.lastIndexOf('/') + 1;

  // establish variable to hold reference to <video> element for later teardown
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const genRandomTime = async (length: number) => {
    const lenMS = length * 1000;
    // define lo and hi time limit for random start times
    const lo = Math.floor(0.1 * lenMS);
    const hi = Math.ceil(0.9 * lenMS);
    return (await window.valleryAPI.getRandomNum(lo, hi)) / 1000;
  };

  // used to enable random start of video playback
  const handleMetadata = async (
    event: React.SyntheticEvent<HTMLVideoElement>,
  ) => {
    const video = event.currentTarget;
    const duration = video.duration;

    // this shouldn't be stricly necessary; video files should be verifed at this point
    if (!duration || isNaN(duration)) return;

    // if random start time is enabled, and 'currTime' is still 0 (on first load), compute random start time and reset current time
    if (randStart) {
      video.currentTime = await genRandomTime(duration);
    }

    // if autoPlay is enabled, begin playback at that location:
    if (video.autoplay) {
      try {
        video.play();
      } catch (err) {
        console.log(`There was an error playing the video: ${err}`);
      }
    }
  };

  // // helper function to set video attributes
  // const popVidEl = (inp: HTMLVideoElement): void => {
  //   inp.src = srcAddress;
  //   inp.className = 'video';
  //   inp.controls = true;
  //   inp.width = vWidth;
  //   // style={{ height: vWidth / (aspRatio[0] / aspRatio[1]), margin: 0 }}
  //   inp.height = vWidth / (aspRatio[0] / aspRatio[1]);
  //   inp.style.margin = '0';
  //   inp.muted = mute;
  //   inp.autoplay = mute && autoStart;
  //   inp.loop = true;
  //   inp.preload = 'metadata';
  // };

  // helper function to set state variable which holds path for maximized videos
  const maxiMizer = () => {
    if (document.fullscreenElement) {
      console.log(`Entering fullscreen mode (${path})...`);
      maxVidIdSet(path);
    } else {
      console.log(`Exiting fullscreen mode (${path})...`);
      maxVidIdSet(null);
    }
  };

  useEffect(() => {
    const thisVid = videoRef.current;

    if (!thisVid) return;

    // popVidEl(thisVid);

    console.log('Adding event listeners...');
    // thisVid.addEventListener('loadedmetadata', handleMetadata);
    thisVid.addEventListener('fullscreenchange', maxiMizer);

    // cleanup function to ensure expediant reallocation of resources
    return () => {
      // if <VideoItem> unmounts before ref is created
      if (!thisVid) return;

      // thisVid.removeEventListener('loadedmetadata', handleMetadata);
      thisVid.removeEventListener('fullscreenchange', maxiMizer);
      thisVid.pause();
      thisVid.removeAttribute('src');
      thisVid.load();
    };
  }, []);

  useEffect(() => {
    const thisVid = videoRef.current;

    if (!thisVid) return;

    // a video has been maximized
    if (maxVidId !== null) {
      // this video has been maximized; continue playing
      if (maxVidId === path) {
        return;
      }

      // a different video has been maximized; pause this one
      thisVid.pause();
      setTStamp(thisVid.currentTime);
      return;
    }

    // maxVidId === null; a previously maximized video is (de)maximized OR this is the initial playback

    // this video was not the previously maximized video; simply resume playback
    if (thisVid.paused && tStamp) {
      try {
        thisVid.play();
      } catch (err) {
        console.log(`There was an error resuming ${path}:${err}`);
      }
      return;
    }

    // this video was the previously maximized video OR this is initial playback; simply return
    return;
  }, [maxVidId]);

  // all of the inline styling included below is crucial to proper function
  return (
    <div>
      <video
        src={srcAddress}
        // update videoRef.current to refer to this element
        ref={videoRef}
        className='video'
        controls
        width={vWidth}
        height={vWidth / (aspRatio[0] / aspRatio[1])}
        style={{ margin: 0 }}
        muted={mute}
        // audio playback must be muted for autoPlay to work
        autoPlay={mute && autoStart}
        loop={true}
        preload='metadata'
        onLoadedMetadata={(event) => handleMetadata(event)}
      ></video>
      <p style={{ margin: 0, paddingTop: '5px' }}>{path.slice(lastSlash)}</p>
    </div>
  );
}
