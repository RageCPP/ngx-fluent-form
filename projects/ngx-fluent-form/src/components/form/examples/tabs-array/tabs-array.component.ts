import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { button, FluentFormComponent, FluentGridModule, form, group, input, tabsArray } from 'ngx-fluent-form';

@Component({
  standalone: true,
  imports: [FluentFormComponent, FluentGridModule, JsonPipe],
  templateUrl: './tabs-array.component.html'
})
export class TabsArrayExampleComponent {
  schema = form(() => {
    tabsArray('passengers')
      .label('乘客')
      .length({ min: 1, max: 5 })
      .col(12)
      .schemas(() => {
        group().col(12).schemas(() => {
          input('name').label('姓名').placeholder('请输入姓名').col(12);
          input('cellphone').label('电话').placeholder('请输入电话').col(12);
        });
      });

    button().content('提交').type('primary').col(12).variants({ block: true });
  });

  model = {
    passengers: [
      {
        name: '李四',
        cellphone: '13800138000'
      }
    ]
  };
}
