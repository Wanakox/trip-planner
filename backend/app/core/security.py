from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """Genera un hash seguro a partir de una contraseña."""

    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """Comprueba si una contraseña coincide con un hash."""

    return password_hash.verify(
        plain_password,
        hashed_password,
    )