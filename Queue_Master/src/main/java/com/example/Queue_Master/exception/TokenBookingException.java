package com.example.Queue_Master.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TokenBookingException extends RuntimeException {

    public TokenBookingException(String message) {
        super(message);
    }

    public TokenBookingException(String message, Throwable cause) {
        super(message, cause);
    }
}