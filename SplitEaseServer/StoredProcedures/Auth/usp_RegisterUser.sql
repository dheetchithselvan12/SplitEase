delimiter $$

create procedure usp_RegisterUser(
    in p_Name varchar(100),
    in p_Mobile varchar(20),
    in p_PasswordHash varchar(255)
)
begin
    insert into Users
    (
        Name,
        Mobile,
        PasswordHash,
        CreatedAt
    )
    values
    (
        p_Name,
        p_Mobile,
        p_PasswordHash,
        now()
    );
    
    select 
        UserId,
        Name,
        Mobile,
        CreatedAt
    from  Users
    where UserId = last_insert_id();

end $$

delimiter ;