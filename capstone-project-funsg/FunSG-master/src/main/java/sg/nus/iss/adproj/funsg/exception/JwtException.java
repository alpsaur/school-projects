package sg.nus.iss.adproj.funsg.exception;

public class JwtException extends RuntimeException {

    public JwtException(final String message) {
        super(message);
    }

    public JwtException(final String message, final Throwable cause) {
        super(message, cause);
    }
}
