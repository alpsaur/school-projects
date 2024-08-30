package sg.nus.iss.adproj.funsg.exception;

public class JwtMissingException extends JwtException {
    public JwtMissingException(String message) {
        super(message);
    }
}
