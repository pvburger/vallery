import type { VideoItemProps } from '../../types';

export default function VideoItem(props: VideoItemProps) {
  const { path, vWidth, mute, autoStart, randStart } = props;

  const srcAddress = `http://127.0.0.1:3333/video?path=${path}`;
  const lastSlash = path.lastIndexOf('/') + 1;

  // used to enable random start of video playback
  const handleMetadata = async (
    event: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    const video = event.currentTarget;
    const duration = video.duration;

    // this shouldn't be stricly necessary; video files should be verifed at this point
    if (!duration || isNaN(duration)) return;

    // if random start time is enabled, compute random start time and reset current time
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

  const genRandomTime = async (length: number) => {
    const lenMS = length * 1000;
    // define lo and hi time limit for random start times
    const lo = Math.floor(0.1 * lenMS);
    const hi = Math.ceil(0.9 * lenMS);
    return (await window.valleryAPI.getRandomNum(lo, hi)) / 1000;
  };

  // all of the inline styling included below is crucial to proper function
  return (
    <div>
      <div style={{ height: vWidth * (9 / 16) }}>
        <video
          src={srcAddress}
          controls
          width={vWidth}
          muted={mute}
          // audio playback must be muted for autoPlay to work
          autoPlay={mute && autoStart}
          loop={true}
          preload='metadata'
          onLoadedMetadata={(event) => handleMetadata(event)}
          style={{ margin: 0 }}
        ></video>
      </div>
      <p style={{ margin: 0, paddingTop: '5px' }}>{path.slice(lastSlash)}</p>
    </div>
  );
}
