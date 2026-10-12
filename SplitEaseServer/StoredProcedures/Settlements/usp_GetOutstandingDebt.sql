delimiter $$

create procedure usp_GetOutstandingDebt(
    in p_GroupId int,
    in p_PayerId int,
    in p_ReceiverId int
)
begin
    declare v_PayerBalance decimal(10,2) default 0;
    declare v_ReceiverBalance decimal(10,2) default 0;
            
    select 
        coalesce(
            sum(ep.NetAmount),0
        )
        +
        coalesce(
        (
            select sum(s.Amount)
            from Settlements s
            where s.GroupId = p_GroupId
                and s.PayerId = p_PayerId
            ),0
        )
        -
        coalesce(
        (
            select sum(s.Amount)
            from Settlements s
            where s.GroupId = p_GroupId
                and s.ReceiverId = p_PayerId
            ),
            0
        )
        into v_PayerBalance
        from Expenses e
        inner join ExpenseParticipants ep
            on ep.ExpenseId = e.ExpenseId
        where e.GroupId = p_GroupId
            and ep.UserId = p_PayerId;

        select 
            coalesce(
                sum(ep.NetAmount),0
            )
            +
            coalesce(
                (
                    select sum(s.Amount)
                    from Settlements s
                    where s.GroupId = p_GroupId
                        and s.PayerId = p_ReceiverId
                    ),0
            )
            -
            coalesce(
                (
                    select sum(s.Amount)
                    from Settlements s
                    where s.GroupId = p_GroupId
                        and s.ReceiverId = p_ReceiverId
                    ),0
            )
        
            into v_ReceiverBalance
            from Expenses e
            inner join ExpenseParticipants ep
                on ep.ExpenseId = e.ExpenseId
            where e.GroupId = p_GroupId
                and ep.UserId = p_ReceiverId;

            select 
                v_PayerBalance as PayerBalance,
                v_ReceiverBalance as ReceiverBalance,
            case
                when v_PayerBalance < 0
                and v_ReceiverBalance > 0
                
                then least(
                     ABS(v_PayerBalance),
                     v_ReceiverBalance
                     )
                else 0
            end as OutstandingAmount;
end $$

delimiter ;