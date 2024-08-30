package sg.nus.iss.adproj.funsg.exception;

public class JwtMalformedException extends JwtException{
    public JwtMalformedException(String message) {
        super(message);
    }
}
