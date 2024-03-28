$(function () { 
   $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});


(function (global) {

  var sn = {};
  
  var homeHtml = "/Snippets/home.html";
  var categoriesData = "/json/category.json"
  var categoriesHtml = "/Snippets/category.html";
  var categoryTitleHtml = "/Snippets/category-tile.html"
  var menuItemsUrl = "/json/items/";
  var menuItemsTitleHtml = "/Snippets/single-category-tile.html";
  var menuItemHtml = "/Snippets/single-category.html";
  var aboutHtml = "/Snippets/about.html";


 
  
  // Convenience function for inserting innerHTML for 'select'
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };
  
  // Show loading icon inside element identified by 'selector'.
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='/Images/loading.gif'></div>";
    insertHtml(selector, html);
  };
  
  //Return substitute of {{propName}}
  //with propvalue in given string
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string
      .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }
  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }



// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;
  classes = document.querySelector("#about").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#about").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") == -1) {
    classes += " active";
    
    document.querySelector("#navMenuButton").className = classes;
  }
};

var switchMenuToActiveforabout = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;
  classes = document.querySelector("#navMenuButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navMenuButton").className = classes;
  
  classes = document.querySelector("#about").className;
  if (classes.indexOf("active") == -1) {
    classes += " active";
    
    document.querySelector("#about").className = classes;
  }
};
  
  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {
  
  // On first load, show home view
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    homeHtml,
    function (responseText) {

      document.querySelector("#main-content")
        .innerHTML = responseText;
    },
    false);
  });
sn.loadaboutHtml = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    aboutHtml,
    function (responseText) {
      document.querySelector("#main-content")
      .innerHTML =responseText;
      switchMenuToActiveforabout()
    },
    false);
  }

  //Load the menu categories view
  sn.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      categoriesData,
      buildAndShowCategoriesHTML);
      switchMenuToActive();

  };


   // Load the menu items view
  // 'categoryShort' is a short_name for a category
  sn.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort + ".json",
      buildAndShowMenuItemsHTML);
  };


  //Builds html for the categories page based on the 
  //from the server
  function buildAndShowCategoriesHTML(categories) {
    $ajaxUtils.sendGetRequest(
    categoryTitleHtml,
    function (categoryTitleHtml) {
      //Retrive single category snippets
      $ajaxUtils.sendGetRequest(
        categoriesHtml,
        function (categoriesHtml) {
          var categoriesViewHtml =
          buildCategoriesViewHtml(categories,
                                  categoryTitleHtml,
                                  categoriesHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
  }

  //using categories data and snippets html
  //build cateogries view html to be inseted into page
  function buildCategoriesViewHtml (categories,
                                    categoryTitleHtml,
                                    categoriesHtml) {
      var finalHtml = categoryTitleHtml;
      finalHtml += "<sectoin class='row'>";
  //loop over categories
  for (var i = 0; i < categories.length; i ++) {
    var html = categoriesHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html =
    insertProperty(html, "name", name);
    html =
    insertProperty(html, "short_name", short_name);
    finalHtml += html;
  }
  finalHtml += "</section>";
  return finalHtml;
}


// Builds HTML for the single category page based on the data
  // from the server
  function buildAndShowMenuItemsHTML (categoryMenuItems) {
    // Load title snippet of menu items page
    $ajaxUtils.sendGetRequest(
      menuItemsTitleHtml,
      function (menuItemsTitleHtml) {
        // Retrieve single menu item snippet
        $ajaxUtils.sendGetRequest(
          menuItemHtml,
          function (menuItemHtml) {
            var menuItemsViewHtml =
              buildMenuItemsViewHtml(categoryMenuItems,
                                     menuItemsTitleHtml,
                                     menuItemHtml);
            insertHtml("#main-content", menuItemsViewHtml);
           
          },
          false);
      },
      false);
  }
  


    // Using category and menu items data and snippets html
  // build menu items view HTML to be inserted into page
  function buildMenuItemsViewHtml(categoryMenuItems,
      menuItemsTitleHtml,
      menuItemHtml) {

      menuItemsTitleHtml =
      insertProperty(menuItemsTitleHtml,
      "name",
      categoryMenuItems.category.name);
      menuItemsTitleHtml =
      insertProperty(menuItemsTitleHtml,
      "special_instructions",
      categoryMenuItems.category.special_instructions);

      var finalHtml = menuItemsTitleHtml;
      finalHtml += "<section class='row'>";

      // Loop over menu items
      var menuItems = shuffle(categoryMenuItems.menu_items); 
      var catShortName = categoryMenuItems.category.short_name;
      for (var i = 0; i < menuItems.length; i++) {
      // Insert menu item values
      var html = menuItemHtml;
      html =
      insertProperty(html, "short_name", menuItems[i].short_name);
      html =
      insertProperty(html,
      "catShortName",
      catShortName);
      html =
      insertItemPrice(html,
      "price_small",
      menuItems[i].price_small);
      html =
      insertItemPortionName(html,
      "small_portion_name",
      menuItems[i].small_portion_name);
      html =
      insertItemPrice(html,
      "price_large",
      menuItems[i].price_large);
      html =
      insertItemPortionName(html,
      "large_portion_name",
      menuItems[i].large_portion_name);
      html =
      insertProperty(html,
      "name",
      menuItems[i].name);
      html =
      insertProperty(html,
      "description",
      menuItems[i].description);
      html =
      insertColors(html,
        "colors",
        menuItems[i].colors);
      html=
      insertSizes(html,
        "size",
        menuItems[i].size);

      // Add clearfix after every second menu item
      if (i % 2 != 0) {
      html +=
      "<div class='clearfix visible-lg-block visible-md-block'></div>";
      }

      finalHtml += html;
      }

      finalHtml += "</section>";
      return finalHtml;
      }


      // Appends price with '$' if price exists
      function insertItemPrice(html,
      pricePropName,
      priceValue) {
      // If not specified, replace with empty string
      if (!priceValue) {
      return insertProperty(html, pricePropName, "");;
      }

      priceValue = "$" + priceValue.toFixed(2);
      html = insertProperty(html, pricePropName, priceValue);
      return html;
      }


      // Appends portion name in parens if it exists
      function insertItemPortionName(html,
        portionPropName,
        portionValue) {
      // If not specified, return original string
      if (!portionValue) {
      return insertProperty(html, portionPropName, "");
      }

      portionValue = "(" + portionValue + ")";
      html = insertProperty(html, portionPropName, portionValue);
      return html;
}
        function insertColors (html,propname,value) {
                  if(!value) {
          return insertProperty(html,propname, "");
          }
          else {
            html = insertProperty(html, propname, "<span>Colors : </span>" + value)
          }
          return html;

        }
        function insertSizes (html,propname,value) {
          if(!value) {
            return insertProperty(html,propname, "");
            }
            else {
              html = insertProperty(html, propname, "<span>Sizes : </span>" + value)
            }
            return html;
        }



        // function chooseRandomCategory (categories) {
        //   // Choose a random index into the array (from 0 inclusively until array length (exclusively))
        //   var randomArrayIndex = Math.floor(Math.random() * categories.length);
        
        //   // return category object with that randomArrayIndex
        //   return categories[randomArrayIndex];
        // }
  

  global.$sn = sn;
  
  })(window);