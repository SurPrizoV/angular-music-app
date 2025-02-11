import { TestBed } from '@angular/core/testing';
import { SearchFilterService } from './searchFilter.service';
import { PlayerService } from './player.service';
import { Track } from '../interfaces';

describe('SearchFilterService', () => {
  let service: SearchFilterService;
  let playerServiceMock: jasmine.SpyObj<PlayerService>;

  const mockTracks: Track[] = [
    {
      id: 1,
      name: 'Track 1',
      author: 'Artist 1',
      track: 'assets/track1.mp3',
      album: '',
      duration: 0,
      genre: 'Pop',
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
      genre: 'Electro',
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
      genre: 'Rock',
      release: new Date(),
      stared: [],
    },
  ];

  beforeEach(() => {
    playerServiceMock = jasmine.createSpyObj('PlayerService', ['setTracks']);

    TestBed.configureTestingModule({
      providers: [
        SearchFilterService,
        { provide: PlayerService, useValue: playerServiceMock },
      ],
    });
    service = TestBed.inject(SearchFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set tracks', () => {
    service.setTracks(mockTracks);
    expect(service['tracksSubj'].value).toEqual(mockTracks);
  });

  it('should update track', () => {
    service.setTracks(mockTracks);
    service.updateTrack(1, { name: 'Updated Track 1' });

    const updatedTrack = service['tracksSubj'].value.find(
      (track) => track.id === 1
    );
    expect(updatedTrack?.name).toBe('Updated Track 1');
  });

  it('should filter tracks by search term', (done) => {
    service.setTracks(mockTracks);
    service.updateSearch('Track 1');

    service.filterTracks().subscribe((filteredTracks) => {
      expect(filteredTracks.length).toBe(1);
      expect(filteredTracks[0].name).toBe('Track 1');
      done();
    });
  });

  it('should filter tracks by author', (done) => {
    service.setTracks(mockTracks);
    service.updateAuthorFilter(['Author 1']);

    service.filterTracks().subscribe((filteredTracks) => {
      expect(filteredTracks.length).toBe(0);
      expect(filteredTracks.every((track) => track.author === 'Author 1')).toBe(
        true
      );
      done();
    });
  });

  it('should filter tracks by genre', (done) => {
    service.setTracks(mockTracks);
    service.updateGenreFilter(['Rock']);

    service.filterTracks().subscribe((filteredTracks) => {
      expect(filteredTracks.length).toBe(1);
      expect(filteredTracks[0].genre).toBe('Rock');
      done();
    });
  });

  it('should shuffle tracks', (done) => {
    service.setTracks(mockTracks);
    service.toggleShuffle(true);

    service.filterTracks().subscribe((filteredTracks) => {
      expect(filteredTracks).not.toEqual(mockTracks);
      expect(filteredTracks.length).toBe(mockTracks.length);
      done();
    });
  });

  it('should call playerService.setTracks after filtering', (done) => {
    service.setTracks(mockTracks);
    service.updateSearch('Track 1');

    service.filterTracks().subscribe(() => {
      expect(playerServiceMock.setTracks).toHaveBeenCalled();
      done();
    });
  });
});
