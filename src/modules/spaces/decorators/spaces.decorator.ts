// import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

// export const ApiFile =
//   (options?: ApiPropertyOptions): PropertyDecorator =>
//   (target: object, propertyKey: string | symbol) => {
//     if (options?.isArray) {
//       ApiProperty({
//         type: 'array',
//         required: options && options.required ? options.required : false,
//         items: {
//           type: 'file',
//           properties: {
//             [propertyKey]: {
//               type: 'string',
//               format: 'binary',
//             },
//           },
//         },
//       })(target, propertyKey);
//     } else {
//       ApiProperty({
//         type: 'file',
//         required: options && options.required ? options.required : false,
//         properties: {
//           [propertyKey]: {
//             type: 'string',
//             format: 'binary',
//           },
//         },
//       })(target, propertyKey);
//     }
//   };
