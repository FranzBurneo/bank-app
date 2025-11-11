using System.Runtime.Serialization;

namespace Bank.Domain;

public enum AccountType
{
    [EnumMember(Value = "Ahorro")]
    Ahorro = 0,

    [EnumMember(Value = "Corriente")]
    Corriente = 1
}
public enum MovementType { Credito = 1, Debito = 2 }