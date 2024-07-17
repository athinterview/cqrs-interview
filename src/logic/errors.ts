export class CQRSError extends Error {

}

export class ObjectNotFoundError extends CQRSError {
}

export class ObjectValidationError extends CQRSError {
}

export class ObjectDataError extends CQRSError {

}
