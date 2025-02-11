import { TestBed } from '@angular/core/testing';
import { SelectService } from './select.service';
import { SelectComponent } from '../components/select/select.component';

describe('SelectService', () => {
  let service: SelectService;
  let mockSelect1: SelectComponent;
  let mockSelect2: SelectComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectService],
    });
    service = TestBed.inject(SelectService);

    mockSelect1 = jasmine.createSpyObj('SelectComponent', ['close']);
    mockSelect2 = jasmine.createSpyObj('SelectComponent', ['close']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a select as active', () => {
    service.register(mockSelect1);
    expect(service['activeSelect']).toBe(mockSelect1);
  });

  it('should unregister a select if it is active', () => {
    service.register(mockSelect1);
    service.unregister(mockSelect1);
    expect(service['activeSelect']).toBeNull();
  });

  it('should not unregister a select if it is not active', () => {
    service.register(mockSelect1);
    service.unregister(mockSelect2);
    expect(service['activeSelect']).toBe(mockSelect1);
  });

  it('should toggle active select and close the previous one', () => {
    service.register(mockSelect1);
    service.toggle(mockSelect2);

    expect(mockSelect1.close).toHaveBeenCalled();
    expect(service['activeSelect']).toBe(mockSelect2);
  });

  it('should not close the previous select if it is the same as the new one', () => {
    service.register(mockSelect1);
    service.toggle(mockSelect1);

    expect(mockSelect1.close).not.toHaveBeenCalled();
    expect(service['activeSelect']).toBe(mockSelect1);
  });
});