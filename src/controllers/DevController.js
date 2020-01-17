const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
    async index (req, res){
        const devs = await Dev.find()

        return res.json(devs)
    },
    
    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;
        
        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiRes = await axios.get(`https://api.github.com/users/${github_username}`)
        
            const { name = login, avatar_url, bio } = apiRes.data;
        
            const techsArray = parseStringAsArray(techs)
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        
            await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs : techsArray,
                location
            })
        }
    
        return res.json(dev)
    },

    async update(req, res){
        const { techs,  name, avatar_url, bio, longitude, latitude} = req.body
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }
        const dev = await Dev.findOneAndUpdate(req.params.id, { techs,  name, avatar_url, bio, location});
        return res.json(dev);
    },

    async destroy(req, res){
        const dev = await Dev.findByIdAndDelete(req.params.id);
        return res.json(dev);
    }
}