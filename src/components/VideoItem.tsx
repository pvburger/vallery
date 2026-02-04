import { useEffect, useRef } from 'react';
import type { VideoItemProps } from '../../types';

export default function VideoItem(props: VideoItemProps) {
  const {
    path,
    vWidth,
    aspRatio,
    mute,
    autoStart,
    randStart,
    maxVidId,
    maxVidIdSet,
    virtScrollRef,
    izMax,
  } = props;

  const tStamp = useRef(0);
  const vidPaused = useRef(false);
  const izViz = useRef(false);
  const wasMax = useRef(false);

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

    // guard against late metadata after teardown and (non-visible) items (according to IntersectionObserver in useEffect)
    if (!video.getAttribute('src') || !izViz.current) return;

    const duration = video.duration;

    // this shouldn't be stricly necessary; video files should be verifed at this point
    if (!duration || isNaN(duration)) return;

    // if tStamp has a non-zero value, video has been torn down and then re-initialized; resume playback from tStamp
    // else, if tStamp === 0 AND randStart is true, get a random start time
    if (tStamp.current !== 0) {
      video.currentTime = tStamp.current;
    } else if (randStart) {
      video.currentTime = await genRandomTime(duration);
    }

    // if autoStart is enabled on first run OR the video was playing prior to being torn down, begin playback at that location:
    if (
      (autoStart && tStamp.current === 0) ||
      (tStamp.current !== 0 && !vidPaused.current)
    ) {
      tStamp.current = 0;
      vidPaused.current = false;
      // // added for development
      // console.log(`PLAY (${video.currentTime}: ${path})`);
      video.play().catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.log(`There was an error playing the video: ${err}`);
      });
    } else {
      // <video> was already loaded and paused before maximize event OR autoStart is false
      vidPaused.current = true;
    }
  };

  // helper function to set state variable which holds path for maximized videos
  const maxiMizer = () => {
    if (document.fullscreenElement) {
      // // added for devlopment
      // console.log(`Entering fullscreen mode (${path})...`);
      maxVidIdSet(path);
    } else {
      // // added for devlopment
      // console.log(`Exiting fullscreen mode (${path})...`);
      maxVidIdSet(null);
    }
  };

  useEffect(() => {
    const thisVid = videoRef.current;

    if (!thisVid) return;

    const vizCrossOver = 0.4;
    // entryViz and exitViz are used to implement hysteresis, to prevent oscillation of izViz.current when <video> visibility is exactly at the vizCrossOver
    const entryViz = vizCrossOver + 0.05;
    const exitViz = vizCrossOver - 0.05;

    const vizObserver = new IntersectionObserver(
      ([entry]) => {
        // exit IntersectionObserver on maximize events; it's not needed and creates problems
        if (izMax.current) return;

        // // added for debugging
        // console.log(`Observer fired (${path})`);

        // boolean indicator of whether the stipulated area (as a ratio) of the given entry is in the viewport
        const vizRatio = entry.intersectionRatio;

        if (vizRatio >= entryViz) {
          izViz.current = true;
        } else if (vizRatio < exitViz) {
          izViz.current = false;
        }

        // if izViz.current is false
        if (!izViz.current) {
          if (thisVid.getAttribute('src')) {
            thisVid.pause();
            thisVid.removeAttribute('src');
            thisVid.load();
          }
          return;
        }

        // isViz.current is true; just regained visibility?
        // the second condition ensures that videos are only loaded when no other videos are maximized
        if (!thisVid.getAttribute('src')) {
          thisVid.src = srcAddress;
          thisVid.load();
        }
        return;
      },
      {
        root: virtScrollRef,
        threshold: [
          0.31,
          0.33,
          exitViz,
          0.37,
          0.39,
          0.41,
          0.43,
          entryViz,
          0.47,
          0.49,
        ],
      },
    );
    // // added for development
    // console.log('Adding event listeners...');
    thisVid.addEventListener('fullscreenchange', maxiMizer);
    vizObserver.observe(thisVid);

    // cleanup function to ensure expediant reallocation of resources
    return () => {
      // if <VideoItem> unmounts before ref is created
      if (!thisVid) return;

      // // added for development
      // console.log('Removing event listeners...');
      thisVid.removeEventListener('fullscreenchange', maxiMizer);
      vizObserver.disconnect();
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
        wasMax.current = true;
        return;
      }

      // a different video has been maximized; pause or tear down this one...
      // if this video has already loaded and is capable of playing, pause this video
      if (thisVid.readyState >= 3 && izViz.current) {
        if (thisVid.paused) {
          vidPaused.current = true;
        }
        // // added for development
        // console.log(`PAUSE (${thisVid.currentTime}): ${path}`);
        thisVid.pause();

        return;
      }

      // this video has not yet loaded OR is not sufficiently visible; tear it down

      // // added for development
      // console.log(`STOP: ${path}`);

      // WE'RE TEARING DOWN THE VIDEO: DO WE NEED THE CURRENT TIME?
      tStamp.current = thisVid.currentTime;
      thisVid.pause();
      thisVid.removeAttribute('src');
      thisVid.load();

      return;
    }

    // maxVidId === null; a previously maximized video is (de)maximized (this one or another one) OR this is the initial playback
    // this video was the previously maximized video OR this video was successfully loaded prior to previous maximize event.
    if (thisVid.getAttribute('src') && izViz.current) {
      // if video was playing (either maximized or prior to maximize event)
      if (!vidPaused.current) {
        // if video was the previous maximized video
        if (wasMax.current) {
          // reset reference and propogate current state
          wasMax.current = false;
          return;
        }

        // video is not the previous maximized video; restart playback

        // // added for development
        // console.log(`PLAY (${thisVid.currentTime}: ${path})`);

        thisVid.play().catch((err) => {
          if (err instanceof Error && err.name === 'AbortError') return;
          console.log(`There was an error playing the video: ${err}`);
        });
        return;
      }
      // successfully loaded video was in paused state; do not automatically resume playback but reset vidPaused reference
      vidPaused.current = false;
      return;
    }

    // initial playback OR video had been torn down during previous maximize event
    if (izViz.current) {
      thisVid.src = srcAddress;
      thisVid.load();
    }
    return;
  }, [maxVidId]);

  // all of the inline styling included below is crucial to proper function
  return (
    <div style={{ width: vWidth }}>
      <video
        // update videoRef.current to refer to this element
        ref={videoRef}
        className='video'
        controls
        width={vWidth}
        height={vWidth / (aspRatio[0] / aspRatio[1])}
        style={{ margin: 0 }}
        muted={mute}
        autoPlay={false}
        loop={true}
        preload='metadata'
        onLoadedMetadata={(event) => handleMetadata(event)}
      ></video>
      <p
        style={{
          margin: 0,
          paddingTop: '5px',
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {path.slice(lastSlash)}
      </p>
    </div>
  );
}
