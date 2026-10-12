delimiter $$

create procedure usp_CreateSettlement(
    in p_GroupId int,
    in p_PayerId int,
    in p_ReceiverId int,
    in p_Amount decimal(10,2)
)

begin
    insert into Settlements
    (
        GroupId,
        PayerId,
        ReceiverId,
        Amount,
        SettledAt
    )
    values 
    (
        p_GroupId,
        p_PayerId,
        p_ReceiverId,
        p_Amount,
        now()
    );
    
    select
        s.SettlementId,
        s.GroupId,
        s.PayerId,
        payer.Name AS PayerName,
        s.ReceiverId,
        receiver.Name AS ReceiverName,
        s.Amount,
        s.SettledAt
    from Settlements s
    inner join Users payer
        on payer.UserId = s.PayerId
    inner join Users receiver
        on receiver.UserId = s.ReceiverId
    where s.SettlementId = last_insert_id();

end $$

delimiter ;