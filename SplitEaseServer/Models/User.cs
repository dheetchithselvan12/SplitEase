using System;
using System.Collections.Generic;

namespace SplitEase.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public string Mobile { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Expenseparticipant> Expenseparticipants { get; set; } = new List<Expenseparticipant>();

    public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();

    public virtual ICollection<Groupmember> Groupmembers { get; set; } = new List<Groupmember>();

    public virtual ICollection<Group> Groups { get; set; } = new List<Group>();

    public virtual ICollection<Settlement> SettlementPayers { get; set; } = new List<Settlement>();

    public virtual ICollection<Settlement> SettlementReceivers { get; set; } = new List<Settlement>();
}
