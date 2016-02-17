# bundalo CHANGELOG

for pre-1.x versions, please see the [0.x-release](https://github.com/krakenjs/bundalo/tree/0.x-release) branch

## v1.0.0-rc.1

### Breaking

- make all access go via getter function
- Remove all references to the dust bundler

### Feature

- Add fastpath support for property access
- Add a dust formatting function that accepts a model separately from fetching the bundle

### Bug fix

- factor out loopalo and use file-resolver more directly
- safe-wrap callbacks, so exceptions thrown by user's callbacks will be diagnosable