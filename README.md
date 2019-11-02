![Logo of the project](logo.png)

# @valid (at-valid)
> Validate objects by assigning decorators/annotations to properties.

Validation of objects is tedious work. More often than not, validation code is (source-wise) far away from the objects you want to validate. So if you are changing an object, you have to search for the validation code in the whole project.



Imagine you could just use decorators directly on the properties or the whole class you want to validate!

Validation becomes as easy as:

```typescript
@NameDoesNotExistInDB(groups: ['PRE_INSERT']) // async validation
class MyClass {
    @Required()
    @MinLength(3)
    name: string = "";
}

const validationError = await new DecoratorValidator().validate(myClassInstance);
if (validationError) {
    ...
}
```



TODO: link to the Angular FormBuilder adapter.



## Installing / Getting started

### Prerequisites

This package is implemented with ES2015 (see [caniuse.com]([https://caniuse.com/#search=es2015)) in mind and thus should be compatible with even IE11.

### Dependencies

None (to keep the bundle size as small as possible)

### Installation

NPM:

```shell
npm install --save at-valid
```



Yarn:

```shell
yarn add at-valid
```





# Usage

Validation on classes/properties just needs decorators on the properties you want to validate.

We'll call these decorators used for validation "constraints".



## Basic property validation

Add the desired decorators to the properties of your class (*Decorating properties defined in the constructor is not supported (yet) due to limitations of typescript!*).



**Important facts:** 

* By convention, all constraints treat `null` and `undefined` as valid values (in other words: optional values).
  To enforce a value, there is the `@Required()` decorator.
* Properties are validated independently of each other.
* All constraints per property are executed sequentially in the order they appear in the source (i.e.: top-down). This also holds for async constraints!.
  Constraint-execution for that property is stopped at the first error.



This makes declaring validation as easy as:

```typescript
class MyClass {
    // some optional property that - if there is a value - needs a minimum length of 3
    @MinLength(3)
    optionalProperty?: string;
    
    // this property is required and must evaluate to a number with a value >= 5
    @Required()
    @IsNumber()
    @Min(5)
    someValueFromAPI?: any;
}
```



To perform the actual validation:

```typescript
const fixture = new MyClass();

const result = await new DecoratorValidation().validate(fixture);

if (result.isError) {
    console.log('property validation errors: ', JSON.stringify(result.propertyErrors));   
}

// prints:
{
	"success": false,
	"propertyErrors": {
		"someValueFromAPI": {
			"propertyKey": "someValueFromAPI",
			"path": "$.someValueFromAPI",
			"validatorName": "Required",
			"validatorFnContext": {"args": {}, "customContext": {}}
		}
	}
}
// please note: there are no errors for optionalProperty since it is not required/optional
```


Various constraints are found in the [src/decorators/constraints](src/decorators/constraints) folder.
Constraint names (for e.g. building error messages) are defined in [src/decorators/ValidatorNames.ts](src/decorators/ValidatorNames.ts).

To see how you might implement your own decorators, see [Advanced Usage](#advanced-usage)







## Basic class validation



## Nesting





# Advanced Usage

## CustomContext



## Build your own validator





## 





## Developing

Here's a brief intro about what a developer must do in order to start developing
the project further:

```shell
git clone https://github.com/your/awesome-project.git
cd awesome-project/
packagemanager install
​```

And state what happens step-by-step.

### Building

If your project needs some additional steps for the developer to build the
project after some code changes, state them here:

​```shell
./configure
make
make install
​```

Here again you should state what actually happens when the code above gets
executed.

### Deploying / Publishing

In case there's some step you have to take that publishes this project to a
server, this is the right time to state it.

​```shell
packagemanager deploy awesome-project -s server.com -u username -p password
​```

And again you'd need to tell what the previous code actually does.

## Features

What's all the bells and whistles this project can perform?
* What's the main functionality
* You can also do another thing
* If you get really randy, you can even do this

## Configuration

Here you should write what are all of the configurations a user can enter when
using the project.

#### Argument 1
Type: `String`  
Default: `'default value'`

State what an argument does and how you can use it. If needed, you can provide
an example below.

Example:
​```bash
awesome-project "Some other value"  # Prints "You're nailing this readme!"
​```

#### Argument 2
Type: `Number|Boolean`  
Default: 100

Copy-paste as many of these as you need.

## Contributing

When you publish something open source, one of the greatest motivations is that
anyone can just jump in and start contributing to your project.

These paragraphs are meant to welcome those kind souls to feel that they are
needed. You should state something like:

"If you'd like to contribute, please fork the repository and use a feature
branch. Pull requests are warmly welcome."

If there's anything else the developer needs to know (e.g. the code style
guide), you should link it here. If there's a lot of things to take into
consideration, it is common to separate this section to its own file called
`CONTRIBUTING.md` (or similar). If so, you should say that it exists here.

## Links

Even though this information can be found inside the project on machine-readable
format like in a .json file, it's good to include a summary of most useful
links to humans using your project. You can include links like:

- Project homepage: https://your.github.com/awesome-project/
- Repository: https://github.com/your/awesome-project/
- Issue tracker: https://github.com/your/awesome-project/issues
  - In case of sensitive bugs like security vulnerabilities, please contact
    my@email.com directly instead of using issue tracker. We value your effort
    to improve the security and privacy of this project!
- Related projects:
  - Your other project: https://github.com/your/other-project/
  - Someone else's project: https://github.com/someones/awesome-project/


## Licensing

The code in this project is licensed under MIT license, see [LICENSE.md](LICENSE.md).

```