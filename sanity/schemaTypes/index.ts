import { type SchemaTypeDefinition } from 'sanity'
import { customerType } from './customerType'
import { categoryType } from './categorytypes'
import { productType } from './productType'
import { orderType } from './orderType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [customerType,categoryType,productType,orderType],
}
