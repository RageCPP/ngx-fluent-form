import { Directive, EventEmitter, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SafeAny } from '@ngify/types';
import { asapScheduler, fromEvent, observeOn, Subject, takeUntil } from 'rxjs';
import { ComponentOutputListenerMap, HTMLElementEventListenerMap } from '../fluent-form.type';
import { ControlSchema } from '../schemas/index.schema';

@Directive({
  selector: '[fluentEventBinder]'
})
export class FluentEventBinderDirective<H extends object, S extends ControlSchema> implements OnChanges, OnDestroy {
  @Input() fluentEventBinder!: { host: H, schema: S, control: FormControl };

  private destory$: Subject<void> = new Subject<void>();

  constructor() { }

  ngOnChanges({ fluentEventBinder }: SimpleChanges): void {
    if (!fluentEventBinder.firstChange) {
      this.destory$.next();
    }

    const { host, schema, control } = this.fluentEventBinder;
    schema.listener && Object.keys(schema.listener).forEach(eventName => {
      if (eventName === 'valueChange') {
        control.valueChanges.pipe(
          observeOn(asapScheduler), // 微任务调度，确保顶层事件先发射
          takeUntil(this.destory$),
        ).subscribe(schema.listener![eventName]!);
      } else if (eventName === 'statusChange') {
        control.statusChanges.pipe(
          observeOn(asapScheduler),
          takeUntil(this.destory$),
        ).subscribe(schema.listener![eventName]!);
      } else if (host instanceof HTMLElement) {
        fromEvent(host, eventName).pipe(
          takeUntil(this.destory$)
        ).subscribe(event => (schema.listener as HTMLElementEventListenerMap)![
          eventName as keyof HTMLElementEventListenerMap
        ]!(event as SafeAny))
      } else {
        (host[eventName as keyof H] as unknown as EventEmitter<unknown>).pipe(
          takeUntil(this.destory$)
        ).subscribe((event: SafeAny) => {
          (schema.listener as ComponentOutputListenerMap<H>)![
            eventName as keyof ComponentOutputListenerMap<H>
          ]!(event);
        });
      }
    });
  }

  ngOnDestroy() {
    this.destory$.next();
    this.destory$.complete();
  }
}