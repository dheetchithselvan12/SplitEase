DELIMITER    $$

CREATE PROCEDURE usp_GetUserByMobile(
    IN  p_Mobile varchar(20)
)
begin 
    select 
        UserId,
        Name,
        Mobile,
        PasswordHash,
        CreatedAt
    from Users
    where Mobile = p_Mobile
    limit 1;

end $$

DELIMITER ;
