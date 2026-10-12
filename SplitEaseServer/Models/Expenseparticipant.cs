using System;
using System.Collections.Generic;

namespace SplitEase.Models;

public partial class Expenseparticipant
{
    public int ExpenseParticipantId { get; set; }

    public int ExpenseId { get; set; }

    public int UserId { get; set; }

    public decimal ShareAmount { get; set; }

    public decimal NetAmount { get; set; }

    public virtual Expense Expense { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
