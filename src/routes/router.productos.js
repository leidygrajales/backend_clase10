const { Router } = require('express')
const Container = require('../container/container.js')

const router = Router()

const archivo = new Container('./src/productos.json')

router.get('', async (req, res) => {
  try {
    return res.status(200).json(await archivo.getAll())
  } catch (error) {
    return res.status(500).json({ error: 'Error al consultar la data' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    return res.status(200).json(await archivo.getById(req.params.id))
  } catch (error) {
    return res.status(500).json({ error: 'Error al consultar la data' })
  }
})

router.post('', async (req, res) => {
  try {
    const result = await archivo.save(req.body)
    return res.status(200).redirect('/')
  } catch (error) {
    return res.status(500).json({ error: 'Error al insertar el registro' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    return res.status(200).json(await archivo.updateById(req.params.id, req.body))
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el registro' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    return res.status(200).json(await archivo.deleteById(req.params.id))
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el registro' })
  }
})

module.exports = router
