# ============================================================
# AUTENTICACIÓN Y USUARIOS
# ============================================================


class EmailAlreadyRegisteredError(Exception):
    """El correo electrónico ya está asociado a otro usuario."""


class UsernameAlreadyRegisteredError(Exception):
    """El nombre de usuario ya está asociado a otro usuario."""


class InvalidCredentialsError(Exception):
    """El identificador o la contraseña son incorrectos."""


# ============================================================
# MONEDAS Y SERVICIOS EXTERNOS
# ============================================================


class CurrencyProviderError(Exception):
    """No se pudo obtener información del proveedor de monedas."""


class UnsupportedCurrencyError(Exception):
    """El código de moneda no está soportado."""


# ============================================================
# VIAJES
# ============================================================


class TripNotFoundError(Exception):
    """El viaje no existe o no pertenece al usuario."""


class InvalidTripDatesError(Exception):
    """La fecha final es anterior a la fecha inicial."""


class TripNotCompletedError(Exception):
    """El viaje todavía no está completado."""


# ============================================================
# DESTINOS
# ============================================================


class DestinationNotFoundError(Exception):
    """El destino no existe o no pertenece al viaje indicado."""


class LastDestinationDeletionError(Exception):
    """No se puede eliminar el único destino de un viaje."""


class DestinationLimitExceededError(Exception):
    """El viaje ha alcanzado el número máximo de destinos."""


# ============================================================
# ORDENACIÓN
# ============================================================


class InvalidDestinationOrderError(Exception):
    """La lista de destinos no representa un orden válido."""


class InvalidActivityOrderError(Exception):
    """La lista de actividades no representa un orden válido."""


# ============================================================
# ACTIVIDADES
# ============================================================


class ActivityNotFoundError(Exception):
    """La actividad no existe o no pertenece al viaje indicado."""


class InvalidActivityDayError(Exception):
    """El número de día no está dentro de la duración del viaje."""


# ============================================================
# TRANSPORTES
# ============================================================


class TransportNotFoundError(Exception):
    """El transporte no existe o no pertenece al viaje indicado."""


class InvalidTransportDatesError(Exception):
    """Las fechas u horas del transporte no son coherentes."""


class TransportOutsideTripDatesError(Exception):
    """El transporte se encuentra fuera de las fechas del viaje."""


# ============================================================
# ALOJAMIENTOS
# ============================================================


class AccommodationNotFoundError(Exception):
    """El alojamiento no existe o no pertenece al viaje indicado."""


class InvalidAccommodationDatesError(Exception):
    """Las fechas u horas del alojamiento no son coherentes."""


class AccommodationOutsideTripDatesError(Exception):
    """El alojamiento se encuentra fuera de las fechas del viaje."""


# ============================================================
# PARTICIPANTES
# ============================================================


class ParticipantNotFoundError(Exception):
    """El participante no existe o no pertenece al viaje indicado."""


class ParticipantHasExpensesError(Exception):
    """El participante tiene gastos asociados y no puede eliminarse."""


# ============================================================
# GASTOS
# ============================================================


class ExpenseNotFoundError(Exception):
    """El gasto no existe o no pertenece al viaje indicado."""


class InvalidExpenseAmountError(Exception):
    """La cantidad del gasto debe ser mayor que cero."""


# ============================================================
# TAREAS
# ============================================================


class TaskNotFoundError(Exception):
    """La tarea no existe o no pertenece al viaje indicado."""


class InvalidTaskOrderError(Exception):
    """
    La lista de ordenación no contiene exactamente todas
    las tareas del viaje o sus posiciones no son válidas.
    """


