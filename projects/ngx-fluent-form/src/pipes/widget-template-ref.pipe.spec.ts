import { EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { WIDGET_MAP } from '../tokens';
import { FluentWidgetTemplateRefPipe } from './widget-template-ref.pipe';

describe('FluentWidgetTemplateRefPipe', () => {
  beforeEach(() => {
    TestBed.overrideProvider(WIDGET_MAP, { useValue: new Map() });
  });

  it('create an instance', () => {
    const environmentInjector = TestBed.inject(EnvironmentInjector);
    const pipe = environmentInjector.runInContext(() => new FluentWidgetTemplateRefPipe());
    expect(pipe).toBeTruthy();
  });
});