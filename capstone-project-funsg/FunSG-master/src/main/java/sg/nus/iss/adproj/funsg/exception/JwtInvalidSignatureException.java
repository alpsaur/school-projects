package sg.nus.iss.adproj.funsg.exception;

public class JwtInvalidSignatureException extends JwtException {
    public JwtInvalidSignatureException(String message) {
        super(message);
    }
}
