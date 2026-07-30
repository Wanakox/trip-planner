class EmailAlreadyRegisteredError(Exception):
    pass


class UsernameAlreadyRegisteredError(Exception):
    pass

class InvalidCredentialsError(Exception):
    pass

class CurrencyProviderError(Exception):
    """No se pudo obtener información del proveedor de monedas."""


class UnsupportedCurrencyError(Exception):
    """El código de moneda no está soportado."""


class TripNotFoundError(Exception):
    """El viaje no existe o no pertenece al usuario."""


class InvalidTripDatesError(Exception):
    """La fecha final es anterior a la fecha inicial."""


class TripNotCompletedError(Exception):
    """El viaje todavía no está completado."""

