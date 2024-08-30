package sg.nus.iss.adproj.funsg.exception;

public class JwtExpiredException extends JwtException{
    public JwtExpiredException(String message) {
        super(message);
    }
}
