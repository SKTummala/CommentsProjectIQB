create or replace FUNCTION getcomments()
  returns  setof public.commnetstable
AS
$func$
  SELECT * 
  FROM commnetstable;
$func$ 
LANGUAGE sql;

select *
from	getcomments()


create or replace FUNCTION insertComment
(
  name varchar(1000)
) 
returns  setof public.commnetstable
AS $$
   insert into commnetstable  ("comment") values (name) returning * ;
$$
LANGUAGE sql;

select *
from	insertComment('Newly added')
