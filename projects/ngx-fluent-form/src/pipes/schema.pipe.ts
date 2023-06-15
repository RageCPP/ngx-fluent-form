import { Pipe, PipeTransform } from '@angular/core';
import { AnyControlSchema, AnySchema, AnySchemaKey, FormArraySchema, FormGroupSchema, StandardSchema } from '../schemas';
import { schemasUtils } from '../utils';

@Pipe({
  name: 'schema',
  standalone: true
})
export class FluentSchemaPipe implements PipeTransform {

  /**
   * 将 value 作为 key，获取 schemas 中的图示
   * @param value
   * @param schemas
   * @param type 用来重载方法的返回值
   */
  transform(value: AnySchemaKey, schemas: StandardSchema<AnySchema>[], type: 'control'): StandardSchema<AnyControlSchema> | null;
  transform(value: AnySchemaKey, schemas: StandardSchema<AnySchema>[], type: 'group'): StandardSchema<FormGroupSchema> | null;
  transform(value: AnySchemaKey, schemas: StandardSchema<AnySchema>[], type: 'array'): StandardSchema<FormArraySchema> | null;
  transform(value: AnySchemaKey, schemas: StandardSchema<AnySchema>[]): StandardSchema<AnySchema> | null;
  transform(value: AnySchemaKey, schemas: StandardSchema<AnySchema>[]): StandardSchema<AnySchema> | null {
    return schemasUtils(schemas).find(value);
  }

}
