import Pool                 from 'pg'
import connectConfig        from './connectConfig.js'

const pool = new Pool.Pool({
    user:     connectConfig.user,
    host:     connectConfig.host,
    database: connectConfig.database,
    password: connectConfig.password,
    port:     connectConfig.port,
})

class DAO {

    async getNicknameExist(nickname) {
        const haveUserData = await pool.query(`SELECT 1 
                                               FROM users 
                                               WHERE nickname = '${nickname}' 
                                               LIMIT 1`)
        return haveUserData.rowCount
    }
    
    async saveUser(email, hashedPassword, nickname) {
        await pool.query(`INSERT INTO users (email, password, nickname) 
                          VALUES ('${email}', '${hashedPassword}', '${nickname}')`)
        return true
    }

    async getUserPasswordByEmail(email) {
        const passwordData = await pool.query(`SELECT password 
                                               FROM users 
                                               WHERE email = '${email}' 
                                               LIMIT 1`)
        return (passwordData.rowCount) ? passwordData.rows[0].password : null
    }

    async getUserUidByEmail(email) {
        const uidData = await pool.query(`SELECT uid 
                                          FROM users 
                                          WHERE email = '${email}' 
                                          LIMIT 1`)
        return (uidData.rowCount) ? uidData.rows[0].uid : null
    }

    async getUserInfoByUid(uid) {
        const userData = await pool.query(`SELECT row_to_json(users) FROM (
                                              SELECT u.email
                                                   , u.nickname
                                                   , (SELECT json_agg(row_to_json(tags)) FROM (
                                                        SELECT t.id
                                                             , t.name
                                                             , cast(t.sortOrder as varchar)
                                                        FROM usertag ut
                                                          left join tags t ON t.id = ut.tag_id
                                                        WHERE ut.user_uid = u.uid
                                                      ) tags) as tags
                                              FROM users u
                                              WHERE u.uid = '${uid}'
                                           ) as users`)
        return (userData.rowCount) ? userData.rows[0].row_to_json : null
    }

    async updateUser(uid, email, hashedPassword, nickname) {
        let updateColumns = ''
        updateColumns += (email) ?          `email = '${email}',`             : ''
        updateColumns += (hashedPassword) ? `password = '${hashedPassword}',` : ''
        updateColumns += (nickname) ?       `nickname = '${nickname}',`       : ''
        updateColumns = updateColumns.slice(0, updateColumns.length-1)
        await pool.query(`UPDATE users
                          SET ${updateColumns}
                          WHERE uid = '${uid}'`)
        return true
    }

    async getUserNicknameByUid(uid) {
        const nicknameData = await pool.query(`SELECT nickname 
                                               FROM users 
                                               WHERE uid = '${uid}' 
                                               LIMIT 1`)
        return (nicknameData.rowCount) ? nicknameData.rows[0].nickname : null
    }

    async getUserEmailByUid(uid) {
        const emailData = await pool.query(`SELECT email
                                            FROM users 
                                            WHERE uid = '${uid}' 
                                            LIMIT 1`)
        return (emailData.rowCount) ? emailData.rows[0].email : null
    }

    async deleteUser(uid) {
        await pool.query(`DELETE 
                          FROM users
                          WHERE uid = '${uid}'`)
        return true
    }

    async getTagByName(name) {
        const tagData = await pool.query(`SELECT json_agg(json_build_object('id',cast(id as VARCHAR),
                                                                            'name',name,
                                                                            'sortOrder',cast(sortOrder as VARCHAR)))  
                                          FROM tags
                                          WHERE name = '${name}'
                                          LIMIT 1`)
        return (tagData.rows[0].json_agg) ? tagData.rows[0].json_agg[0] : null
    }

    async saveTag(uid, name, sortOrder) {
        await pool.query(`INSERT INTO tags (name, sortOrder, creator) 
                          VALUES ('${name}', '${sortOrder}', '${uid}')`)
        return true
    }

    async getTagById(id) {
        const tagData = await pool.query(`SELECT row_to_json(tags) FROM (
                                            SELECT t.name
                                                , cast(t.sortorder as VARCHAR)
                                                , (SELECT row_to_json(users) FROM (
                                                    (SELECT nickname
                                                          , uid
                                                     FROM users
                                                     WHERE uid = t.creator)
                                                ) as users) as creator
                                            FROM tags t
                                            WHERE t.id = '${id}'
                                        ) as tags`)
        return (tagData.rowCount) ? tagData.rows[0].row_to_json : null
    }

    async checkCanModifyTag(userUid, tagId) {
        const tagData = await pool.query(`SELECT 1 
                                          FROM tags 
                                          WHERE id = '${tagId}' 
                                            and creator = '${userUid}'`)
        return tagData.rowCount
    }

    async updateTag(tagId, name, sortOrder) {
        let updateColumns = ''
        updateColumns += (name) ?      `name      = '${name}',`      : ''
        updateColumns += (sortOrder) ? `sortOrder = '${sortOrder}',` : ''
        updateColumns = updateColumns.slice(0, updateColumns.length-1)
        await pool.query(`UPDATE tags
                          SET ${updateColumns}
                          WHERE id = '${tagId}'`)
        return true
    }

    async deleteTag(id) {
        await pool.query(`DELETE FROM usertag WHERE tag_id = '${id}';
                          DELETE FROM tags    WHERE id     = '${id}'`)
        return true
    }

    async bindTags(uid, bindedTags) {
        // TODO: добавить проверку, что добавляемых связей еще нет.
        let values = ''
        for (let i = 0; i < bindedTags.length; i++) {
            values += `('${uid}', '${bindedTags[i]}'),`
        }
        values = values.slice(0, values.length-1)
        await pool.query(`INSERT INTO usertag (user_uid, tag_id) 
                          VALUES ${values}`)
        return true
    }

    async getUserTags(uid) {
        const usertagData = await pool.query(`SELECT row_to_json(users) FROM (
                                              SELECT (SELECT json_agg(row_to_json(tags)) FROM (
                                                    SELECT t.id
                                                        , t.name
                                                        , cast(t.sortOrder as varchar)
                                                    FROM usertag ut
                                                        left join tags t ON t.id = ut.tag_id
                                                    WHERE ut.user_uid = u.uid
                                                    ) tags) as tags
                                              FROM users u
                                              WHERE u.uid = '${uid}'
                                             ) as users`)
        return (usertagData.rowCount) ? usertagData.rows[0].row_to_json : null
    }
    
    async udbindTag(userUid, tagId) {
        await pool.query(`DELETE FROM usertag 
                          WHERE tag_id   = '${tagId}'
                            and user_uid = '${userUid}'`)
        return true
    }

    async getTags(sortByOrder, sortByName, page, pageSize) {
        let sort = 'id'
        if (sortByOrder && sortByName)  { sort = 'sortOrder, name' }
        if (sortByOrder && !sortByName) { sort = 'sortOrder' }
        if (!sortByOrder && sortByName) { sort = 'name' }
        
        const data = await pool.query(`
       
            SELECT row_to_json(dt)
            FROM (SELECT --
                        (SELECT row_to_json(meta) as data 
                            FROM (
            
                                SELECT ${page} as page
                                     , ${pageSize} as pageSize
                                     , (SELECT count(*) FROM tags) as quantity
            
                        ) as meta) as meta, 	  
            
                        (SELECT json_agg(row_to_json(tags)) as data 
                            FROM (
            
                                SELECT t.name
                                     , t.sortOrder
                                     , (SELECT json_agg(row_to_json(u)) 
                                        FROM (
                                            SELECT nickname, uid 
                                            FROM users 
                                            WHERE uid = t.creator
                                        ) as u) as creator
                                FROM (
                                        SELECT name
                                             , sortOrder
                                             , creator
                                             , row_number() OVER (ORDER BY ${sort} ASC) as num
                                        FROM tags
                                        ) as t
                                WHERE num > ${page * pageSize}
                                  and num <= ${(+page+1) * pageSize}
            
                        ) as tags)
            
            ) as dt `)
        return (data.rowCount) ? data.rows[0].row_to_json : null
    }

}

export default new DAO()