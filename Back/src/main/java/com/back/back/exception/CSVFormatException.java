package com.back.back.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// 415 Unsupported Media Type (Para CSV incorrecto)
@ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
public class CSVFormatException extends RuntimeException {
    public CSVFormatException(String message) {
        super(message);
    }
}