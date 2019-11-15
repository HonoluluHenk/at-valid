/**
 * Constants for validators used in this library.
 */
export enum ValidatorNames {
    IsString = 'IsString',
    IsNumber = 'IsNumber',
    IsInteger = 'IsInteger',
    IsBoolean = 'IsBoolean',
    IsDatetime = 'IsDatetime',
    IsBefore = 'IsDatetimeBefore',
    IsAfter = 'IsAfter',
    IsDate = 'IsDate',
    Required = 'Required',
    MinLength = 'MinLength',
    MaxLength = 'MaxLength',
    Min = 'Min',
    Max = 'Max',
    IsArray = 'IsArray',
    IsEnum = 'IsEnum',
    Matches = 'Matches',
    IsUUID = 'IsUUID',
    IsEqualTo = 'IsEqualTo',
    IsIn = 'IsIn',

    // structural
    Nested = 'Nested'
}
