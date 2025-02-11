import { TimeFormatPipe } from './time-format.pipe';

describe('TimeFormatPipe', () => {
  let pipe: TimeFormatPipe;

  beforeEach(() => {
    pipe = new TimeFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format time correctly for values less than 60 seconds', () => {
    expect(pipe.transform(0)).toBe('00:00');
    expect(pipe.transform(30)).toBe('00:30');
    expect(pipe.transform(59)).toBe('00:59');
  });

  it('should format time correctly for values more than or equal to 60 seconds', () => {
    expect(pipe.transform(60)).toBe('01:00');
    expect(pipe.transform(90)).toBe('01:30');
    expect(pipe.transform(125)).toBe('02:05');
    expect(pipe.transform(3600)).toBe('60:00');
  });
});
