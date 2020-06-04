import React, { useEffect, useState, ChangeEvent } from "react"
import { Link } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import { Map, TileLayer, Marker } from "react-leaflet"

import axios from "axios"
import api from "../../services/api"
import logo from "../../assets/logo.svg"
import "./style.css"

interface Item {
  id: number
  title: string
  image_url: string
}

interface UF {
  id: number
  uf: string
  name: string
}

interface IBGEUF {
  id: number
  nome: string
  sigla: string
}
interface IBGECity {
  nome: string
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<UF[]>([])
  const [selectedUF, setSelectedUF] = useState("0")
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState("0")

  useEffect(() => {
    api
      .get("/items")
      .then((response) => {
        setItems(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    axios
      .get<IBGEUF[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      )
      .then((response) => {
        const ufInitials = response.data.map((initial) => {
          return {
            id: initial.id,
            name: initial.nome,
            uf: initial.sigla,
          }
        })
        setUfs(ufInitials)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    if (selectedUF === "0") {
      return
    }
    axios
      .get<IBGECity[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios?orderBy=nome`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome)
        setCities(cityNames)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [selectedUF])

  function hundleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedUF(event.target.value)
  }

  function hundleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value)
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          <Map center={[-15.8289662, -48.0506021]} zoom={15}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-15.8289662, -48.0506021]} />
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                onChange={hundleSelectUF}
                value={selectedUF}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option value={uf.uf} key={uf.id}>
                    {uf.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                onChange={hundleSelectCity}
                value={selectedCity}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option value={city} key={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens de coleta</span>
          </legend>
          <ul className="items-grid">
            {items.map((item) => (
              <li key={item.id}>
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint
