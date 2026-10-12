using System;
using System.Collections.Generic;

namespace SplitEase.Models;

public partial class Settlement
{
    public int SettlementId { get; set; }

    public int GroupId { get; set; }

    public int PayerId { get; set; }

    public int ReceiverId { get; set; }

    public decimal Amount { get; set; }

    public DateTime SettledAt { get; set; }

    public virtual Group Group { get; set; } = null!;

    public virtual User Payer { get; set; } = null!;

    public virtual User Receiver { get; set; } = null!;
}
