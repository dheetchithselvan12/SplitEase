using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using SplitEase.Models;

namespace SplitEase.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Expense> Expenses { get; set; }

    public virtual DbSet<Expenseparticipant> Expenseparticipants { get; set; }

    public virtual DbSet<Group> Groups { get; set; }

    public virtual DbSet<Groupmember> Groupmembers { get; set; }

    public virtual DbSet<Settlement> Settlements { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(e => e.ExpenseId).HasName("PRIMARY");

            entity.ToTable("expenses");

            entity.HasIndex(e => e.GroupId, "FK_Expenses_Group");

            entity.HasIndex(e => e.PaidByUserId, "FK_Expenses_PaidByUser");

            entity.Property(e => e.Amount).HasPrecision(10, 2);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);

            entity.HasOne(d => d.Group).WithMany(p => p.Expenses)
                .HasForeignKey(d => d.GroupId)
                .HasConstraintName("FK_Expenses_Group");

            entity.HasOne(d => d.PaidByUser).WithMany(p => p.Expenses)
                .HasForeignKey(d => d.PaidByUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Expenses_PaidByUser");
        });

        modelBuilder.Entity<Expenseparticipant>(entity =>
        {
            entity.HasKey(e => e.ExpenseParticipantId).HasName("PRIMARY");

            entity.ToTable("expenseparticipants");

            entity.HasIndex(e => e.UserId, "FK_ExpenseParticipants_User");

            entity.HasIndex(e => new { e.ExpenseId, e.UserId }, "UQ_ExpenseParticipants_Expense_User").IsUnique();

            entity.Property(e => e.NetAmount).HasPrecision(10, 2);
            entity.Property(e => e.ShareAmount).HasPrecision(10, 2);

            entity.HasOne(d => d.Expense).WithMany(p => p.Expenseparticipants)
                .HasForeignKey(d => d.ExpenseId)
                .HasConstraintName("FK_ExpenseParticipants_Expense");

            entity.HasOne(d => d.User).WithMany(p => p.Expenseparticipants)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ExpenseParticipants_User");
        });

        modelBuilder.Entity<Group>(entity =>
        {
            entity.HasKey(e => e.GroupId).HasName("PRIMARY");

            entity.ToTable("groups");

            entity.HasIndex(e => e.CreatedBy, "FK_Groups_CreatedBy");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Groups)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Groups_CreatedBy");
        });

        modelBuilder.Entity<Groupmember>(entity =>
        {
            entity.HasKey(e => e.GroupMemberId).HasName("PRIMARY");

            entity.ToTable("groupmembers");

            entity.HasIndex(e => e.UserId, "FK_GroupMembers_User");

            entity.HasIndex(e => new { e.GroupId, e.UserId }, "UQ_GroupMembers_Group_User").IsUnique();

            entity.Property(e => e.JoinedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Group).WithMany(p => p.Groupmembers)
                .HasForeignKey(d => d.GroupId)
                .HasConstraintName("FK_GroupMembers_Group");

            entity.HasOne(d => d.User).WithMany(p => p.Groupmembers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_GroupMembers_User");
        });

        modelBuilder.Entity<Settlement>(entity =>
        {
            entity.HasKey(e => e.SettlementId).HasName("PRIMARY");

            entity.ToTable("settlements");

            entity.HasIndex(e => e.GroupId, "FK_Settlements_Group");

            entity.HasIndex(e => e.PayerId, "FK_Settlements_Payer");

            entity.HasIndex(e => e.ReceiverId, "FK_Settlements_Receiver");

            entity.Property(e => e.Amount).HasPrecision(10, 2);
            entity.Property(e => e.SettledAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Group).WithMany(p => p.Settlements)
                .HasForeignKey(d => d.GroupId)
                .HasConstraintName("FK_Settlements_Group");

            entity.HasOne(d => d.Payer).WithMany(p => p.SettlementPayers)
                .HasForeignKey(d => d.PayerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Settlements_Payer");

            entity.HasOne(d => d.Receiver).WithMany(p => p.SettlementReceivers)
                .HasForeignKey(d => d.ReceiverId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Settlements_Receiver");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Mobile, "Mobile").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Mobile).HasMaxLength(15);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
