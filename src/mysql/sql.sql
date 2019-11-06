CREATE DATABASE IF NOT EXISTS IIS1;
USE IIS1;
create table user_(id integer AUTO_INCREMENT, first_name varchar(50), second_name varchar(50),password varchar(100), mail varchar(100),active boolean, country_code varchar(2), born date,sex ENUM('F', 'M', 'N'),  photo blob, primary key(id));
create table player(id integer AUTO_INCREMENT, user_id integer, actual_p_rank double, highest_p_rank double, height double, weight double, played_side ENUM('Both', 'Right', 'Left'), coach varchar(100), primary key(id));
create table tournament(id integer AUTO_INCREMENT, name_ varchar(100), max_n_of_teams int, required_n_of_players int, prizes varchar(200), tournament_age_category enum('Adults','Everyone','Juniors','Seniors'), tournament_sex_category enum('F', 'M', 'N'), registration_fee double,logo blob, founder_id int, state enum('open','ready_to_play','ongoing','played'),actual_rank int, primary key(id));
create table team (id int AUTO_INCREMENT,founder_id integer, name_ varchar(100), logo blob,funded date,active boolean, primary key(id));
create table team_tournament(id int AUTO_INCREMENT,tournament_id int, team_id int, tournament_pos int,primary key(id));
create table rating_team(wins int, losses int, fan_rat double, info varchar(100), team_tournament_id int, match_id int, primary key(team_tournament_id,match_id));
create table ref_tournament(tournament_id int, user_id int, primary key(tournament_id,user_id));
create table player_team(team_id int, player_id int,primary key(player_id, team_id));
create table ref_match(match_id int, user_id int, ref_rat double, primary key(match_id, user_id));
create table rating_player(kills int, deaths int, assists int, headshots int, fan_rat double, money_spent decimal(5), player_id int, match_id int, ban varchar(150), info varchar(150), primary key(player_id, match_id));
create table match_(id int AUTO_INCREMENT, date_of_play TIMESTAMP, place varchar(100), ticket_prize decimal(7,2),tournament_id int, primary key(id)); -- match blbne!
-- create table debug(note varchar(500), first_ int, second_ int); !

ALTER TABLE tournament      ADD FOREIGN KEY (founder_id)        REFERENCES user_ (id)            on delete RESTRICT on update CASCADE;   -- delete by nemal nastat NECHAVAME TIENOVY PROFIL KVOLI REFEREE !
ALTER TABLE team            ADD FOREIGN KEY (founder_id)        REFERENCES user_(id)            on delete RESTRICT on update CASCADE;   -- we do not delte user !
ALTER TABLE team_tournament ADD FOREIGN KEY (team_id)           REFERENCES team (id)            on delete RESTRICT on update CASCADE;   -- if team_tournament exists do not allow delete team !
ALTER TABLE team_tournament ADD FOREIGN KEY (tournament_id)     REFERENCES tournament (id)      on delete CASCADE on update CASCADE;    -- if we delete tournament, team_tournament too !
ALTER TABLE rating_team     ADD FOREIGN KEY (team_tournament_id)REFERENCES team_tournament (id) on delete CASCADE on update CASCADE;    -- if we are deleting tournament, the table team_tournament will go too, and so will go this table !
ALTER TABLE rating_team     ADD FOREIGN KEY (match_id)          REFERENCES match_ (id)          on delete CASCADE on update CASCADE;   -- we can not delte match !
ALTER TABLE ref_tournament  ADD FOREIGN KEY (tournament_id)     REFERENCES tournament (id)      on delete CASCADE on update CASCADE;    -- if we delete tournament, ref_tournament too !
ALTER TABLE ref_tournament  ADD FOREIGN KEY (user_id)           REFERENCES user_ (id)           on delete RESTRICT on update CASCADE;   -- we do not delete user !
ALTER TABLE player_team     ADD FOREIGN KEY (team_id)           REFERENCES team (id)            on delete CASCADE on update CASCADE;    -- if we delete team, we also delte player_team !
ALTER TABLE player_team     ADD FOREIGN KEY (player_id)         REFERENCES player (id)          on delete RESTRICT on update CASCADE;   -- we do not delete player !
ALTER TABLE ref_match       ADD FOREIGN KEY (match_id)          REFERENCES match_ (id)          on delete CASCADE on update CASCADE;    -- if we delete match ref_match too !
ALTER TABLE ref_match       ADD FOREIGN KEY (user_id)           REFERENCES user_ (id)           on delete RESTRICT on update CASCADE;   -- we do not delete user !
ALTER TABLE rating_player   ADD FOREIGN KEY (player_id)         REFERENCES player (id)          on delete RESTRICT on update CASCADE;   -- we do not delete player !
ALTER TABLE rating_player   ADD FOREIGN KEY (match_id)          REFERENCES match_ (id)          on delete CASCADE on update CASCADE;    -- we delete rating_player with match too 
ALTER TABLE player          ADD FOREIGN KEY (user_ID)           REFERENCES user_(id)            on delete RESTRICT on update CASCADE;   -- we do not delete user !
ALTER TABLE match_          ADD FOREIGN KEY (tournament_id)     REFERENCES tournament(id)       on delete CASCADE on update CASCADE;   -- delete match with tournament


DELIMITER //
CREATE TRIGGER check_player_user BEFORE INSERT ON player
    FOR EACH ROW
    BEGIN
    -- count players that are created with that user id !
		DECLARE n INT;
		SELECT COUNT(*) INTO n FROM player
		INNER JOIN user_ ON user_.id=player.user_id
		WHERE new.user_id=user_.id;
		
        IF(n>0) THEN
			SIGNAL SQLSTATE '45011'
			SET MESSAGE_TEXT = 'user is already a player';
		END IF;
	END //
    
    
CREATE TRIGGER check_player_team_player BEFORE INSERT ON player_team
    FOR EACH ROW
    BEGIN
    -- count players that are with that player id in that team !
		DECLARE n_in INT;
		SELECT COUNT(*) INTO n_in FROM player_team
		INNER JOIN player ON player.id=player_team.player_id
        INNER JOIN team ON team.id=player_team.team_id
		WHERE new.player_id=player.id AND
        new.team_id=team.id;
		
        IF(n_in>0) THEN
			SIGNAL SQLSTATE '45011'
			SET MESSAGE_TEXT = 'user is already a player';
		END IF;
	END //
    
CREATE TRIGGER check_user_ref_tournament BEFORE INSERT ON ref_tournament
    FOR EACH ROW
    BEGIN
		DECLARE n_in INT;
        DECLARE p_in INT;
        -- count referees with that user id in that tournament !
		SELECT COUNT(*) INTO n_in FROM ref_tournament
        INNER JOIN tournament ON tournament.id=ref_tournament.tournament_id
        INNER JOIN user_ ON user_.id=ref_tournament.user_id
		WHERE new.user_id=ref_tournament.user_id AND
        new.tournament_id=ref_tournament.tournament_id;
		
        IF(n_in>0) THEN
			SIGNAL SQLSTATE '45011'
			SET MESSAGE_TEXT = 'user is already a referee';
		END IF;
        
        -- count user with that user id that play that tournament that user wants to register as referee !
        SELECT COUNT(*) INTO p_in FROM player_team
        INNER JOIN player ON player.id=player_team.player_id
        INNER JOIN user_ ON user_.id=player.user_id
        INNER JOIN team ON team.id=player_team.team_id
        INNER JOIN team_tournament ON team_tournament.team_id=team.id
        WHERE user_.id=new.user_id AND
        new.tournament_id=team_tournament.tournament_id;
        
        IF(p_in>0) THEN
			SIGNAL SQLSTATE '45014'
			SET MESSAGE_TEXT = 'user is already a player';
		END IF;
	END //

CREATE TRIGGER check_user_ref_match BEFORE INSERT ON ref_match
    FOR EACH ROW
    BEGIN
		DECLARE n_in INT;
        DECLARE in_t INT;
        
        -- count referees with same user id that are in table ref_tournament, user have to be registered to tournament as referee if he wants to register himself as referee to match !
        SELECT COUNT(*) INTO in_t FROM ref_tournament
        where new.user_id=ref_tournament.user_id;
        
        IF(in_t=0) THEN 
			SIGNAL SQLSTATE '45012'
            SET MESSAGE_TEXT = 'user is not registered to tournament as referee';
		END IF;
        
        -- count referees with same user id that are registered to that match !
		SELECT COUNT(*) INTO n_in FROM ref_match
        INNER JOIN match_ ON match_.id=ref_match.match_id
        INNER JOIN user_ ON user_.id=ref_match.user_id
		WHERE new.user_id=user_.id AND
        new.match_id=match_.id;
		
        IF(n_in>0) THEN
			SIGNAL SQLSTATE '45011'
			SET MESSAGE_TEXT = 'user is already a referee on that match';
		END IF;
	END //
DELIMITER ;

 DELIMITER $$
CREATE TRIGGER check_space_tourn
    BEFORE INSERT ON team_tournament 
    FOR EACH ROW 
    BEGIN
    DECLARE n INT;
    DECLARE posible INT;
    DECLARE n_of_players_in_team INT;
    DECLARE n_of_team_players INT;
    DECLARE sex_player INT;
    DECLARE sex_tournament CHAR(1);
    DECLARE state_tournament enum('open','ready_to_play','ongoing','played');
    DECLARE tournament_age_cat enum('Adults','Everyone','Juniors','Seniors');
    DECLARE age_cat enum('Adults','Everyone','Juniors','Seniors');
    DECLARE b_age INT;
	DECLARE t_id INT;
    DECLARE same_p INT;
	DECLARE same_t_p INT;
    DECLARE player_i INT;
    DECLARE empty_test INT;
   
    DECLARE player_in_team INT;
   
    
	
    
    SELECT max_n_of_teams,required_n_of_players,tournament_sex_category,state,tournament_age_category,id INTO posible,n_of_players_in_team, sex_tournament,state_tournament,tournament_age_cat,t_id FROM tournament
    WHERE new.tournament_id=tournament.id;
    
    -- TRIGGER IF PLAYER IS NOT AS REFEREE IN TOURNAMENT !
    SELECT COUNT(*) INTO same_t_p FROM player_team
    INNER JOIN player ON player.id=player_team.player_id
    INNER JOIN user_ ON user_.id=player.user_id
    WHERE new.team_id=player_team.team_id AND
		user_.id IN (
			SELECT id FROM user_
			INNER JOIN ref_tournament ON ref_tournament.user_id=user_.id
        );
	IF(same_t_p!=0) THEN
		SIGNAL SQLSTATE '45013'
		SET MESSAGE_TEXT = 'player in team is already registered as referee';
	END IF;
    -- END OF TRIGGER IF PLAYER IS NOT AS REFEREE IN TOURNAMENT !

    -- TRIGGER if player is already in tournament in another team !
    -- TO CONTROL IF THE PLAYER is not in any of the team that are registered on that tournament too
				SELECT COUNT(*)  INTO same_t_p FROM player_team
				INNER JOIN team ON team.id=player_team.team_id
				INNER JOIN team_tournament ON team_tournament.team_id=team.id
				WHERE 
                team_tournament.tournament_id=t_id AND
				new.team_id!=team.id AND
                player_team.player_id IN (
					SELECT player_id FROM player_team
					INNER JOIN team ON team.id=player_team.team_id
					WHERE new.tournament_id=t_id AND
					new.team_id=team.id
                    GROUP BY player_team.player_id)
                GROUP BY player_team.player_id;
                IF(same_t_p!=0) THEN
                		SIGNAL SQLSTATE '45010'
						SET MESSAGE_TEXT = 'player in another team in same tournament';
				END IF;
    
    -- END OF TRIGGER if player is already in tournament in another team !

    -- triggers to check torunament age category !
    IF(tournament_age_cat='Juniors') THEN
    SELECT COUNT(*) INTO b_age from user_ 
    INNER JOIN player ON player.user_id = user_.id
	INNER JOIN player_team ON player_team.player_id = player.id
    INNER JOIN team ON team.id = player_team.team_id
    WHERE new.team_id = team.id AND
    TIMESTAMPDIFF(YEAR, user_.born,CURDATE())>18;
    END IF;
    
        IF(tournament_age_cat='Seniors') THEN
    SELECT COUNT(*) INTO b_age from user_ 
    INNER JOIN player ON player.user_id = user_.id
	INNER JOIN player_team ON player_team.player_id = player.id
    INNER JOIN team ON team.id = player_team.team_id
    WHERE new.team_id = team.id AND
    TIMESTAMPDIFF(YEAR, user_.born,CURDATE())<60;
    END IF;
    
        IF(tournament_age_cat='Adults') THEN
    SELECT COUNT(*) INTO b_age from user_ 
    INNER JOIN player ON player.user_id = user_.id
	INNER JOIN player_team ON player_team.player_id = player.id
    INNER JOIN team ON team.id = player_team.team_id
    WHERE new.team_id = team.id AND
    TIMESTAMPDIFF(YEAR, user_.born,CURDATE())<19 AND
    TIMESTAMPDIFF(YEAR, user_.born,CURDATE())>59;
    END IF;
    
    
    IF(b_age!=0) THEN
		SIGNAL SQLSTATE '45007'
		SET MESSAGE_TEXT = 'tournament is different age category';
    END IF;
    
	-- TRIGGER TO check tournament sex category !
    SELECT COUNT(*) INTO sex_player from user_ 
    INNER JOIN player ON player.user_id = user_.id
	INNER JOIN player_team ON player_team.player_id = player.id
    INNER JOIN team ON team.id = player_team.team_id
    WHERE new.team_id = team.id AND
    user_.sex!=sex_tournament; -- OKAY? !
    
    IF(sex_tournament!='N')THEN
		IF(sex_player!=0) THEN
			SIGNAL SQLSTATE '45006'
			SET MESSAGE_TEXT = 'tournament have different sex category that player in team is';
		END IF;
    END IF;
    
   -- check torunament state category !
    IF(state_tournament!='open') THEN
    SIGNAL SQLSTATE '45005'
          SET MESSAGE_TEXT = 'tournament is not open';
	END IF;
    
     -- count players in team
    SELECT COUNT(*) INTO n_of_team_players
    FROM player_team
    INNER JOIN team  ON team.id = player_team.team_id
    where new.team_id=team.id; 

    IF(n_of_players_in_team != n_of_team_players) THEN
	SIGNAL SQLSTATE '45003'
      SET MESSAGE_TEXT = 'bad number of team players';
	END IF;
    
   -- count teams registered to tournament !
    SELECT COUNT(*) INTO n
    FROM team_tournament
    WHERE new.tournament_id=team_tournament.tournament_id;
    
    IF (n=posible) THEN
      SIGNAL SQLSTATE '45002'
      SET MESSAGE_TEXT = 'tournament is full';
    END IF;

 
    END$$
DELIMITER ;

-- TO DO  -DONE !
-- TRIGGER if player is already in tournament in another team  OK !
-- trigger on insert to team, one player can not be twice in one team  OK ! 
-- one user can have only one player table  OK !
-- trigger to check, tournament age and sex category, also free space and state of tournament OK !	
-- ref_tournament, ref_match can user create only once on same tournament, or same match   OK !
-- if user wants to register to match as referee he have to be registered as referee to tournament OK !
-- player cannot be referee in same tournament  trigger in both ways( when team registers OK, and when ref registers)  OK !
