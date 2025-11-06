export class HttpError extends Error {
  status: number;
  details: any;

  constructor(status = 500, message = "Error interno del servidor", details: any = null) {
    super(message);
    this.status = status;
    this.details = details;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
