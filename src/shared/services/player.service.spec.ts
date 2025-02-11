import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { Track } from '../interfaces';

describe('PlayerService', () => {
  let service: PlayerService;

  const mockTracks: Track[] = [
    {
      id: 1,
      name: 'Track 1',
      author: 'Artist 1',
      track: 'assets/track1.mp3',
      album: '',
      duration: 0,
      genre: '',
      release: new Date(),
      stared: [],
    },
    {
      id: 2,
      name: 'Track 2',
      author: 'Artist 2',
      track: 'assets/track2.mp3',
      album: '',
      duration: 0,
      genre: '',
      release: new Date(),
      stared: [],
    },
    {
      id: 3,
      name: 'Track 3',
      author: 'Artist 3',
      track: 'assets/track3.mp3',
      album: '',
      duration: 0,
      genre: '',
      release: new Date(),
      stared: [],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerService],
    });
    service = TestBed.inject(PlayerService);

    spyOn(service['audio'], 'play').and.returnValue(Promise.resolve());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set tracks and update current track', () => {
    service.setTracks(mockTracks);
    expect(service['trackList']).toEqual(mockTracks);
    expect(service['currentIndex']).toBe(0);
    expect(service.currentTrack$.value).toEqual(mockTracks[0]);
  });

  it('should play and pause track', () => {
    service.setTracks(mockTracks);
    service.play();
    expect(service.isPlaying$.value).toBeTrue();

    service.pause();
    expect(service.isPlaying$.value).toBeFalse();
  });

  it('should switch to next track', () => {
    service.setTracks(mockTracks);
    service.next();
    expect(service['currentIndex']).toBe(1);
    expect(service.currentTrack$.value).toEqual(mockTracks[1]);
  });

  it('should switch to previous track', () => {
    service.setTracks(mockTracks);
    service.setCurrentIndex(1);
    service.previous();
    expect(service['currentIndex']).toBe(0);
    expect(service.currentTrack$.value).toEqual(mockTracks[0]);
  });

  it('should handle track end with repeat mode "none"', () => {
    service.setTracks(mockTracks);
    service.setRepeatMode('none');
    service.setCurrentIndex(mockTracks.length - 1);
    service['onTrackEnd']();
    expect(service.isPlaying$.value).toBeFalse();
  });

  it('should handle track end with repeat mode "all"', () => {
    service.setTracks(mockTracks);
    service.setRepeatMode('all');
    service.setCurrentIndex(mockTracks.length - 1);
    service['onTrackEnd']();
    expect(service['currentIndex']).toBe(0);
    expect(service.currentTrack$.value).toEqual(mockTracks[0]);
  });

  it('should set volume', () => {
    const volume = 0.5;
    service.setVolume(volume);
    expect(service['audio'].volume).toBe(volume);
  });

  it('should seek to specific time', () => {
    const time = 30;
    service.seekTo(time);
    expect(service['audio'].currentTime).toBe(time);
  });

  it('should reset track', () => {
    service.setTracks(mockTracks);
    service.play();
    service.resetTrack();
    expect(service['audio'].paused).toBeTrue();
    expect(service['audio'].currentTime).toBe(0);
    expect(service.isPlaying$.value).toBeFalse();
    expect(service.currentTrack$.value).toBeNull();
  });
});
