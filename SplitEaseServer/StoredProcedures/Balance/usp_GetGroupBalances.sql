delimiter $$

create procedure usp_GetGroupBalances(
    in p_GroupId int
)

begin
    select 
        u.UserId,
        u.Name,
        
        coalesce(
        sum(ep.NetAmount),
        0
        ) as RawBalance,
        
        coalesce(
        (
            select  sum(s.Amount)
            from Settlements s
            where s.GroupId = p_GroupId
                and s.PayerId = u.UserId
            ),
        0
        ) as AmountPaidInSettlement,
        
        coalesce(
        (
            select  sum(s.Amount)
            from  Settlements s
            where s.GroupId = p_GroupId
                and s.ReceiverId = u.UserId
            ),
        0
        ) as AmountReceivedInSettlement,
        (
            coalesce(
            sum(ep.NetAmount),
            0
            )
            +
            coalesce(
            (
                select sum(s.Amount)
                from Settlements s
                where s.GroupId = p_GroupId
                    and s.PayerId = u.UserId
                ),
            0
            )
            -
            coalesce(
            (
                select sum(s.Amount)
                from Settlements s
                where s.GroupId = p_GroupId
                    and s.ReceiverId = u.UserId
                ),
            0
            )
            ) as FinalBalance
            
        from GroupMembers gm
        inner join Users u
            on u.UserId = gm.UserId
        left join Expenses e
            on e.GroupId = p_GroupId
        left join ExpenseParticipants ep
            on ep.ExpenseId = e.ExpenseId
            and ep.UserId = u.UserId
        where gm.GroupId = p_GroupId
        group by
            u.UserId,
            u.Name
        order by u.Name;
end $$
    
delimiter ;
