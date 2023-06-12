enum HTTPStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class HTTPError extends Error {
  constructor(public message: string, public status: HTTPStatus, public name: string) {
    super(message)
  }

  public toResponse() {
    return {
      message: this.message,
    }
  }

  public toString() {
    return `${this.name}: ${this.message}`
  }
}

export class BadRequestError extends HTTPError {
  constructor(message: string) {
    super(message, HTTPStatus.BAD_REQUEST, 'Bad Request')
  }
}

export class UnauthorizedError extends HTTPError {
  constructor(message: string) {
    super(message, HTTPStatus.UNAUTHORIZED, 'Unauthorized')
  }
}

export class ForbiddenError extends HTTPError {
  constructor(message: string) {
    super(message, HTTPStatus.FORBIDDEN, 'Forbidden')
  }
}

export class NotFoundError extends HTTPError {
  constructor(message: string) {
    super(message, HTTPStatus.NOT_FOUND, 'Not Found')
  }
}

export class InternalServerError extends HTTPError {
  constructor(message: string) {
    super(message, HTTPStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error')
  }
}
