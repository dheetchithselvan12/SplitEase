delimiter $$

create procedure usp_GetGroupSettlements(
    in p_GroupId int
)

begin
    select 
        s.SettlementId,
        s.GroupId,
        
        s.PayerId,
        payer.Name as PayerName,
        
        s.ReceiverId,
        receiver.Name as ReceiverName,
        
        s.Amount,
        s.SettledAt
    from Settlements s
    inner join Users payer
        on payer.UserId = s.PayerId
    inner join Users receiver
        on receiver.UserId = s.ReceiverId
    where s.GroupId = p_GroupId
    order by s.SettledAt desc;
end $$

delimiter ;