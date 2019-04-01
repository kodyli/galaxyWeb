```js
/**
* Strategy Design Pattern, using different ways to handle a error;
* Template Design Pattern, create different error handler classes;
* Decorator Design Pattern, using it to create error handler classes;
*/
interface IHtml {  
  toHtml();  
}  
  
interface IError extends IHtml {  
  readonly msg: string;  
  readonly errorHandler: IErrorHandler<IError>;  
}  
  
interface IErrorHandler<T extends IError> {  
  handle(error: T);  
}  
  
abstract class AError implements IError {  
  readonly errorHandler: AErrorHandler<AError>;  
  readonly msg: string;  
  
  protected constructor(msg: string, errorHandler: AErrorHandler<AError>) {  
    this.errorHandler = errorHandler;  
    this.msg = msg;  
  }  
  
  toHtml() {  
    this.errorHandler.handle(this);  
  }  
}  
  
abstract class AErrorHandler<T extends AError> implements IErrorHandler<T> {  
  handle(error: T) {  
	//do something in common.  
	this.display(error);  
  }  
  
  abstract display(error: T);  
}  
  
class FieldError extends AError {  
  readonly fieldName: string;  
  
  constructor(fieldName: string, msg: string, errorHandler: AErrorHandler<FieldError>) {  
    super(msg, errorHandler);  
    this.fieldName = fieldName;  
  }  
}  
  
class FieldErrorHandler extends AErrorHandler<FieldError> {  
  display(error: FieldError) {  
  }  
}  
  
abstract class AGridError extends AError {  
  readonly gridId: string;  
  readonly rowId: string;  
  
  protected constructor(gridId: string, rowId: string, msg: string, errorHandler: AErrorHandler<AGridError>) {  
    super(msg, errorHandler);  
    this.gridId = gridId;  
    this.rowId = rowId;  
  }  
}  
  
class CellError extends AGridError {  
  readonly cellName: string;  
  
  constructor(gridId: string, rowId: string, cellName: string, msg: string, errorHandler: AErrorHandler<CellError>) {  
    super(gridId, rowId, msg, errorHandler);  
    this.cellName = cellName;  
  }  
}  
  
class CellErrorHandler extends AErrorHandler<CellError> {  
  display(error: CellError) {  
  }  
}
```