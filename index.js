const url =
  "https://mock.redq.io/api/products?searchJoin=and&with=type%3Bauthor&limit=30&language=en&search=type.slug:grocery%3Bstatus:publish";

let products;

fetch(url)
  .then((res) => {
    // console.log(res)
    return res.json();
  })
  .then((result) => {
    // console.log(result);
    products = result.data;
    result.data.forEach((e) => {
      renderProductCard(e);
    });
    const addToCartBtns = document.querySelectorAll(".addToCart");

    addToCartBtns.forEach((e) => {
      e.addEventListener("click", () => {
        const pid = e.dataset.id;
        const prodcutDetails = products.filter((e) => e.id == pid);
        return addToCart(prodcutDetails[0]);
      });
    });
  })
  .catch((err) => console.log(err));

const root = document.getElementById("root");
const renderProductCard = (product) => {
  const card = `
    <div class="card">
        ${
          product.sale_price
            ? `<p class="card-discount">
            ${(
              ((product.price - product.sale_price) / product.price) *
              100
            ).toFixed(0)}%
        </p>`
            : ""
        }
        <div class="card-img-conatiner">
            <img class="card-img" src="${product.image.original}"/>
        </div>
        <p class="card-name">${product.name}</p>
        <p class="card-weight">${product.unit}</p>
        <div class="card-footer">
        <div>
        ${
          product.sale_price
            ? `<p class="card-disabled-price">
        $${product.price}
         </p>`
            : ""
        }
            <p class="card-price"> $${
              product.sale_price ? product.sale_price : product.price
            }</p>
        </div>
        <div class="card-cart" >
            <p data-id=${product.id} class="addToCart">add to cart</p>
        </div>
        </div>
    </div>
  `;

  root.insertAdjacentHTML("beforeend", card);
};

const cart = {
  products: [],
  totalPrice: 0,
};

const addToCart = (product) => {
  const checkProduct = cart.products.filter((e) => e.id == product.id);
  const price = product.sale_price ? product.sale_price : product.price;
  if (checkProduct.length) {
    cart.totalPrice += price;

    cart.products = cart.products.map((e) => {
      if (e.id == product.id) {
        e.cartQty += 1;
      }
      return e;
    });

    // const index = cart.products.findIndex(e => (e.id == product.id));
    // cart.products[index] +=1
  } else {
    cart.totalPrice += price;
    product.cartQty = 1;
    cart.products.push(product);
    // cart.products.push({...product, cartQty: 1})
  }
  console.log(cart);
};
