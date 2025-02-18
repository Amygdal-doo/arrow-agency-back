import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

const ImageOptions = ['image/jpg', 'image/png', 'image/jpeg'];
const VideoOptions = ['video/mp4'];
const AudioOptions = ['audio/mp3', 'audio/aac'];
const isFilesOptions = [...ImageOptions, ...VideoOptions, ...AudioOptions];

export function IsImageVideoAudioOrNull(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    return registerDecorator({
      name: 'isImageVideoAudio',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value || isFilesOptions.includes(value[0]?.mimetype))
            return true;
          return false;
        },
      },
    });
  };
}
