/**
 * Interface Segregation Principle (ISP)
 *
 * Clients should not be forced to depend on interfaces they do not use.
 * It's better to have many specific interfaces than one general-purpose interface.
 */

// ❌ BAD: Violating ISP - Fat interface that forces unnecessary dependencies
interface WorkerBad {
  work(): void;
  eat(): void;
  sleep(): void;
  attendMeeting(): void;
  code(): void;
  design(): void;
  manage(): void;
  // Every worker must implement ALL of these methods!
}

class DeveloperBad implements WorkerBad {
  work(): void {
    console.log("Developer working on code");
  }

  eat(): void {
    console.log("Developer eating lunch");
  }

  sleep(): void {
    console.log("Developer sleeping");
  }

  attendMeeting(): void {
    console.log("Developer attending meeting");
  }

  code(): void {
    console.log("Developer coding");
  }

  design(): void {
    // Developer might not do design work!
    throw new Error("This developer does not do design work");
  }

  manage(): void {
    // Developer is not a manager!
    throw new Error("This developer does not manage people");
  }
}

// ✅ GOOD: Following ISP - Segregated interfaces

// Basic interface that all workers share
interface Worker {
  work(): void;
}

// Human needs
interface Human {
  eat(): void;
  sleep(): void;
}

// Professional activities
interface MeetingAttendee {
  attendMeeting(): void;
}

interface Programmer {
  code(): void;
  debug(): void;
  reviewCode(): void;
}

interface Designer {
  design(): void;
  createMockups(): void;
}

interface Manager {
  manage(): void;
  conductReviews(): void;
  planProjects(): void;
}

interface Analyst {
  analyzeData(): void;
  createReports(): void;
}

// Implementations using segregated interfaces
class Developer implements Worker, Human, MeetingAttendee, Programmer {
  work(): void {
    console.log("Developer working on features");
  }

  eat(): void {
    console.log("Developer eating at desk");
  }

  sleep(): void {
    console.log("Developer sleeping (when not debugging)");
  }

  attendMeeting(): void {
    console.log("Developer attending standup");
  }

  code(): void {
    console.log("Developer writing TypeScript");
  }

  debug(): void {
    console.log("Developer debugging application");
  }

  reviewCode(): void {
    console.log("Developer reviewing pull request");
  }
}

class UXDesigner implements Worker, Human, MeetingAttendee, Designer {
  work(): void {
    console.log("UX Designer working on user experience");
  }

  eat(): void {
    console.log("UX Designer eating while sketching");
  }

  sleep(): void {
    console.log("UX Designer dreaming of better interfaces");
  }

  attendMeeting(): void {
    console.log("UX Designer presenting design concepts");
  }

  design(): void {
    console.log("UX Designer creating user flows");
  }

  createMockups(): void {
    console.log("UX Designer creating high-fidelity mockups");
  }
}

class ProjectManager implements Worker, Human, MeetingAttendee, Manager {
  work(): void {
    console.log("Project Manager coordinating team");
  }

  eat(): void {
    console.log("Project Manager eating during lunch meeting");
  }

  sleep(): void {
    console.log("Project Manager sleeping between sprints");
  }

  attendMeeting(): void {
    console.log("Project Manager running sprint planning");
  }

  manage(): void {
    console.log("Project Manager managing project timeline");
  }

  conductReviews(): void {
    console.log("Project Manager conducting team reviews");
  }

  planProjects(): void {
    console.log("Project Manager planning next quarter");
  }
}

// Full-stack developer implements multiple technical interfaces
class FullStackDeveloper
  implements Worker, Human, MeetingAttendee, Programmer, Designer
{
  work(): void {
    console.log("Full-stack Developer working on full application");
  }

  eat(): void {
    console.log("Full-stack Developer eating while coding");
  }

  sleep(): void {
    console.log("Full-stack Developer power napping");
  }

  attendMeeting(): void {
    console.log("Full-stack Developer in architecture meeting");
  }

  code(): void {
    console.log("Full-stack Developer coding frontend and backend");
  }

  debug(): void {
    console.log("Full-stack Developer debugging across the stack");
  }

  reviewCode(): void {
    console.log("Full-stack Developer reviewing architecture");
  }

  design(): void {
    console.log("Full-stack Developer designing system architecture");
  }

  createMockups(): void {
    console.log("Full-stack Developer creating technical mockups");
  }
}

// Data Analyst only needs specific interfaces
class DataAnalyst implements Worker, Human, MeetingAttendee, Analyst {
  work(): void {
    console.log("Data Analyst working with datasets");
  }

  eat(): void {
    console.log("Data Analyst eating while reviewing charts");
  }

  sleep(): void {
    console.log("Data Analyst sleeping after long analysis");
  }

  attendMeeting(): void {
    console.log("Data Analyst presenting insights");
  }

  analyzeData(): void {
    console.log("Data Analyst analyzing user behavior data");
  }

  createReports(): void {
    console.log("Data Analyst creating quarterly reports");
  }
}

// Real-world example: Media Player interfaces

// ❌ BAD: Fat interface
interface MediaPlayerBad {
  play(): void;
  pause(): void;
  stop(): void;
  next(): void;
  previous(): void;
  shuffle(): void;
  repeat(): void;
  adjustVolume(level: number): void;
  showVideoControls(): void;
  adjustBrightness(level: number): void;
  changeSubtitles(language: string): void;
  record(): void;
  livestream(): void;
}

// ✅ GOOD: Segregated interfaces
interface BasicPlayer {
  play(): void;
  pause(): void;
  stop(): void;
}

interface PlaylistPlayer extends BasicPlayer {
  next(): void;
  previous(): void;
  shuffle(): void;
  repeat(): void;
}

interface VolumeControl {
  adjustVolume(level: number): void;
  mute(): void;
  unmute(): void;
}

interface VideoPlayer extends BasicPlayer {
  showVideoControls(): void;
  adjustBrightness(level: number): void;
  changeSubtitles(language: string): void;
  toggleFullscreen(): void;
}

interface StreamingCapable {
  livestream(): void;
  stopStream(): void;
}

interface RecordingCapable {
  record(): void;
  stopRecording(): void;
}

// Implementations
class SimpleAudioPlayer implements PlaylistPlayer, VolumeControl {
  play(): void {
    console.log("Playing audio");
  }

  pause(): void {
    console.log("Pausing audio");
  }

  stop(): void {
    console.log("Stopping audio");
  }

  next(): void {
    console.log("Next track");
  }

  previous(): void {
    console.log("Previous track");
  }

  shuffle(): void {
    console.log("Shuffling playlist");
  }

  repeat(): void {
    console.log("Repeating playlist");
  }

  adjustVolume(level: number): void {
    console.log(`Setting volume to ${level}`);
  }

  mute(): void {
    console.log("Muting audio");
  }

  unmute(): void {
    console.log("Unmuting audio");
  }
}

class VideoStreamingPlayer
  implements VideoPlayer, VolumeControl, PlaylistPlayer, StreamingCapable
{
  // Basic player methods
  play(): void {
    console.log("Playing video stream");
  }

  pause(): void {
    console.log("Pausing video stream");
  }

  stop(): void {
    console.log("Stopping video stream");
  }

  // Playlist methods
  next(): void {
    console.log("Next video");
  }

  previous(): void {
    console.log("Previous video");
  }

  shuffle(): void {
    console.log("Shuffling video playlist");
  }

  repeat(): void {
    console.log("Repeating video playlist");
  }

  // Volume control methods
  adjustVolume(level: number): void {
    console.log(`Setting video volume to ${level}`);
  }

  mute(): void {
    console.log("Muting video");
  }

  unmute(): void {
    console.log("Unmuting video");
  }

  // Video-specific methods
  showVideoControls(): void {
    console.log("Showing video controls overlay");
  }

  adjustBrightness(level: number): void {
    console.log(`Setting brightness to ${level}`);
  }

  changeSubtitles(language: string): void {
    console.log(`Changing subtitles to ${language}`);
  }

  toggleFullscreen(): void {
    console.log("Toggling fullscreen mode");
  }

  // Streaming methods
  livestream(): void {
    console.log("Starting livestream");
  }

  stopStream(): void {
    console.log("Stopping livestream");
  }
}

class PodcastPlayer implements BasicPlayer, VolumeControl {
  play(): void {
    console.log("Playing podcast");
  }

  pause(): void {
    console.log("Pausing podcast");
  }

  stop(): void {
    console.log("Stopping podcast");
  }

  adjustVolume(level: number): void {
    console.log(`Setting podcast volume to ${level}`);
  }

  mute(): void {
    console.log("Muting podcast");
  }

  unmute(): void {
    console.log("Unmuting podcast");
  }
}

// Service functions that work with specific interfaces
class MediaService {
  controlBasicPlayback(player: BasicPlayer): void {
    player.play();
    setTimeout(() => player.pause(), 1000);
    setTimeout(() => player.stop(), 2000);
  }

  controlVolume(device: VolumeControl): void {
    device.adjustVolume(75);
    device.mute();
    device.unmute();
  }

  managePlaylist(player: PlaylistPlayer): void {
    player.shuffle();
    player.next();
    player.repeat();
  }

  setupVideoPlayback(player: VideoPlayer): void {
    player.showVideoControls();
    player.adjustBrightness(80);
    player.changeSubtitles("English");
    player.toggleFullscreen();
  }
}

// Usage example
function demonstrateISP(): void {
  console.log("=== Worker Example ===");
  const developer = new Developer();
  const designer = new UXDesigner();
  const manager = new ProjectManager();
  const fullStack = new FullStackDeveloper();
  const analyst = new DataAnalyst();

  // Each worker only implements what they actually do
  developer.code();
  designer.design();
  manager.manage();
  fullStack.code();
  fullStack.design();
  analyst.analyzeData();

  console.log("\n=== Media Player Example ===");
  const audioPlayer = new SimpleAudioPlayer();
  const videoPlayer = new VideoStreamingPlayer();
  const podcastPlayer = new PodcastPlayer();

  const mediaService = new MediaService();

  // Each player only has the methods it needs
  mediaService.controlBasicPlayback(audioPlayer);
  mediaService.controlVolume(audioPlayer);
  mediaService.managePlaylist(audioPlayer);

  mediaService.controlBasicPlayback(videoPlayer);
  mediaService.setupVideoPlayback(videoPlayer);
  videoPlayer.livestream();

  mediaService.controlBasicPlayback(podcastPlayer);
  mediaService.controlVolume(podcastPlayer);
  // podcastPlayer doesn't have playlist or video methods - that's good!
}

// Benefits of following ISP:
// 1. Classes only implement methods they actually need
// 2. Reduces coupling between interfaces and implementations
// 3. Makes code more flexible and maintainable
// 4. Easier to test - mock only the interfaces you need
// 5. Follows the principle of least privilege
// 6. Prevents "fat" interfaces that do too much

export {
  Worker,
  Human,
  MeetingAttendee,
  Programmer,
  Designer,
  Manager,
  Analyst,
  Developer,
  UXDesigner,
  ProjectManager,
  FullStackDeveloper,
  DataAnalyst,
  BasicPlayer,
  PlaylistPlayer,
  VolumeControl,
  VideoPlayer,
  StreamingCapable,
  RecordingCapable,
  SimpleAudioPlayer,
  VideoStreamingPlayer,
  PodcastPlayer,
  MediaService,
  demonstrateISP,
};
