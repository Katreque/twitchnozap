package com.example.twitchnozap

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.twitchnozap.databinding.ViewHolderStickerBinding

class StickersAdapter(
    private val stickerList: List<String>
) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return StickersViewHolder(ViewHolderStickerBinding.inflate(LayoutInflater.from(parent.context)))
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        (holder as StickersViewHolder).bind(stickerList[position])
    }

    override fun getItemCount(): Int = stickerList.size
}